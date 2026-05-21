'use client';
import React, { useState, use } from 'react';
import {
  Box, Typography, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField,
  Chip, Alert, CircularProgress, Switch, FormControlLabel, Select, MenuItem, InputLabel,
  FormControl, FormHelperText, Tooltip, Checkbox,
} from '@mui/material';
import {
  Add, Edit, Delete, ContentCopy, History, Visibility, Refresh,
} from '@mui/icons-material';
import type { NumberSeriesConfig, NumberableEntity, NumberSeriesSegment, NumberSeriesHistoryItem } from '@/app/lib/types';
import { Can } from '@/components/Can';
import {
  createNumberSeriesConfig, updateNumberSeriesConfig, deleteNumberSeriesConfig,
  generateNextNumber, previewNumberSeries, getNumberSeriesHistory,
} from './actions';

const EMPTY_SEGMENT = (): NumberSeriesSegment => ({ type: 'prefix', value: '' });

function formatPreview(segments: NumberSeriesSegment[]): string {
  return segments.map(s => {
    switch (s.type) {
      case 'prefix': return s.value || '';
      case 'separator': return s.value || '';
      case 'date': return `[${s.date_part || 'yyyy'}]`;
      case 'counter': return '0'.repeat(s.width || 4);
      default: return '';
    }
  }).join('');
}

function segmentLabel(s: NumberSeriesSegment): string {
  switch (s.type) {
    case 'prefix': return `"${s.value || ''}"`;
    case 'separator': return `sep:"${s.value || ''}"`;
    case 'date': return `${s.date_part || 'yyyy'}(${s.width || 4})`;
    case 'counter': return `#${s.width || 4}${s.mode === 'manual' ? '✎' : ''}`;
    default: return '';
  }
}

export default function NumberSeriesView({
  configsPromise,
  entitiesPromise,
}: {
  configsPromise: Promise<{ data: NumberSeriesConfig[] | null; error: string | null }>;
  entitiesPromise: Promise<{ data: NumberableEntity[] | null; error: string | null }>;
}) {
  const { data: initialConfigs, error: configsError } = use(configsPromise);
  const { data: initialEntities, error: entitiesError } = use(entitiesPromise);

  const [configs, setConfigs] = useState<NumberSeriesConfig[]>(initialConfigs || []);
  const [entities] = useState<NumberableEntity[]>(initialEntities || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(configsError || entitiesError || '');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NumberSeriesConfig | null>(null);
  const [form, setForm] = useState<{
    entity_type: string;
    name: string;
    description: string;
    segments: NumberSeriesSegment[];
    starting_number: number;
  }>({ entity_type: '', name: '', description: '', segments: [EMPTY_SEGMENT()], starting_number: 1 });

  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [generatedNumber, setGeneratedNumber] = useState<{ configId: string; number: string } | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyConfig, setHistoryConfig] = useState<NumberSeriesConfig | null>(null);
  const [historyItems, setHistoryItems] = useState<NumberSeriesHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const refresh = async () => {
    const res = await import('./actions').then(m => m.getNumberSeriesConfigs());
    setConfigs(res);
  };

  function handleOpen(config?: NumberSeriesConfig) {
    if (config) {
      setEditing(config);
      setForm({
        entity_type: config.entity_type,
        name: config.name,
        description: config.description || '',
        segments: config.segments.length > 0 ? [...config.segments] : [EMPTY_SEGMENT()],
        starting_number: config.starting_number,
      });
    } else {
      setEditing(null);
      setForm({ entity_type: '', name: '', description: '', segments: [EMPTY_SEGMENT()], starting_number: 1 });
    }
    setPreviewResult(null);
    setOpen(true);
  }

  function updateSegment(index: number, patch: Partial<NumberSeriesSegment>) {
    setForm(f => {
      const segments = [...f.segments];
      segments[index] = { ...segments[index], ...patch };
      return { ...f, segments };
    });
  }

  function removeSegment(index: number) {
    setForm(f => ({
      ...f,
      segments: f.segments.length > 1 ? f.segments.filter((_, i) => i !== index) : [EMPTY_SEGMENT()],
    }));
  }

  function addSegment() {
    setForm(f => ({ ...f, segments: [...f.segments, EMPTY_SEGMENT()] }));
  }

  function onSegmentTypeChange(index: number, newType: NumberSeriesSegment['type']) {
    const base = { type: newType };
    if (newType === 'prefix') updateSegment(index, { ...base, value: '' });
    else if (newType === 'separator') updateSegment(index, { ...base, value: '-' });
    else if (newType === 'date') updateSegment(index, { ...base, date_part: 'yyyy', width: 4 });
    else if (newType === 'counter') updateSegment(index, { ...base, width: 4, step: 1, mode: 'auto' });
  }

  async function handlePreview() {
    try {
      setLoading(true);
      const res = await previewNumberSeries(form.entity_type, form.segments, form.starting_number);
      setPreviewResult(res.example);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const payload = {
        entity_type: form.entity_type,
        name: form.name,
        description: form.description || undefined,
        segments: form.segments,
        starting_number: form.starting_number,
      };
      if (editing) {
        await updateNumberSeriesConfig(editing.id, payload);
      } else {
        await createNumberSeriesConfig(payload);
      }
      await refresh();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this number series config?')) return;
    try {
      setLoading(true);
      await deleteNumberSeriesConfig(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(config: NumberSeriesConfig) {
    try {
      const res = await generateNextNumber({ entity_type: config.entity_type });
      setGeneratedNumber({ configId: config.id, number: res.number });
      await refresh();
      setTimeout(() => setGeneratedNumber(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    }
  }

  async function handleOpenHistory(config: NumberSeriesConfig) {
    setHistoryConfig(config);
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const items = await getNumberSeriesHistory(config.id);
      setHistoryItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleToggleActive(config: NumberSeriesConfig) {
    try {
      await updateNumberSeriesConfig(config.id, { is_active: !config.is_active });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle');
    }
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {loading && !open && <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Can permission="number-series.manage">
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ borderRadius: 3, fontWeight: 'bold' }}>New Config</Button>
        </Can>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Entity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Format</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Segments</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Last Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configs.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No number series configured.</TableCell></TableRow>
            )}
            {configs.map((c) => (
              <TableRow key={c.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{c.entity_type}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1 }}>
                    {formatPreview(c.segments)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {c.segments.map((s, i) => (
                      <Chip key={i} label={segmentLabel(s)} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: 11 }} />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>{c.last_sequence_value?.toString() || <Typography variant="body2" color="text.secondary">—</Typography>}</TableCell>
                <TableCell>
                  <Can permission="number-series.manage">
                    <Switch size="small" checked={c.is_active} onChange={() => handleToggleActive(c)} />
                  </Can>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Can permission="number-series.manage">
                      <Tooltip title="Generate next number">
                        <IconButton size="small" onClick={() => handleGenerate(c)} color="primary">
                          <Refresh fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Can>
                    <Tooltip title="View history">
                      <IconButton size="small" onClick={() => handleOpenHistory(c)} color="info">
                        <History fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Can permission="number-series.manage">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpen(c)} color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(c.id)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Can>
                  </Stack>
                  {generatedNumber && generatedNumber.configId === c.id && (
                    <Alert severity="success" sx={{ mt: 1, borderRadius: 2, py: 0 }}>
                      Generated: <strong>{generatedNumber.number}</strong>
                    </Alert>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: '900' }}>{editing ? 'Edit Config' : 'New Number Series Config'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontWeight: 'bold' }}>Entity Type</InputLabel>
              <Select
                value={form.entity_type}
                label="Entity Type"
                disabled={!!editing}
                onChange={(e) => setForm({ ...form, entity_type: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                {entities.map((e) => (
                  <MenuItem key={e.entityType} value={e.entityType}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{e.entityType}</Typography>
                      <Typography variant="caption" color="text.secondary">({e.className})</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {!editing && <FormHelperText>Select which entity this numbering applies to</FormHelperText>}
            </FormControl>

            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <TextField
              label="Description (optional)"
              fullWidth
              multiline
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            {/* Segment Builder */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Format Segments</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Define the structure of the generated number. Add prefix text, date parts, separators, and a counter.
              </Typography>
              <Stack spacing={2}>
                {form.segments.map((seg, i) => (
                  <Paper key={i} elevation={0} sx={{ p: 2, border: '1px solid #eee', borderRadius: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={seg.type}
                          label="Type"
                          onChange={(e) => onSegmentTypeChange(i, e.target.value as NumberSeriesSegment['type'])}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                          <MenuItem value="prefix">Prefix</MenuItem>
                          <MenuItem value="separator">Separator</MenuItem>
                          <MenuItem value="date">Date</MenuItem>
                          <MenuItem value="counter">Counter</MenuItem>
                        </Select>
                      </FormControl>
                      {seg.type === 'prefix' && (
                        <TextField
                          size="small"
                          label="Text"
                          value={seg.value || ''}
                          onChange={(e) => updateSegment(i, { value: e.target.value })}
                          placeholder="e.g. PR-"
                          sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      )}
                      {seg.type === 'separator' && (
                        <TextField
                          size="small"
                          label="Separator"
                          value={seg.value || ''}
                          onChange={(e) => updateSegment(i, { value: e.target.value })}
                          placeholder="e.g. / -"
                          sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      )}
                      {seg.type === 'date' && (
                        <>
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Part</InputLabel>
                            <Select
                              value={seg.date_part || 'yyyy'}
                              label="Part"
                              onChange={(e) => updateSegment(i, { date_part: e.target.value as any })}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                              <MenuItem value="yyyy">Year (4)</MenuItem>
                              <MenuItem value="yy">Year (2)</MenuItem>
                              <MenuItem value="mm">Month</MenuItem>
                              <MenuItem value="dd">Day</MenuItem>
                              <MenuItem value="ww">Week</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            size="small"
                            label="Width"
                            type="number"
                            value={seg.width ?? 4}
                            onChange={(e) => updateSegment(i, { width: parseInt(e.target.value) || 4 })}
                            sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </>
                      )}
                      {seg.type === 'counter' && (
                        <>
                          <TextField
                            size="small"
                            label="Width"
                            type="number"
                            value={seg.width ?? 4}
                            onChange={(e) => updateSegment(i, { width: parseInt(e.target.value) || 4 })}
                            sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                          <TextField
                            size="small"
                            label="Step"
                            type="number"
                            value={seg.step ?? 1}
                            onChange={(e) => updateSegment(i, { step: parseInt(e.target.value) || 1 })}
                            sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Mode</InputLabel>
                            <Select
                              value={seg.mode || 'auto'}
                              label="Mode"
                              onChange={(e) => updateSegment(i, { mode: e.target.value as 'auto' | 'manual' })}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                              <MenuItem value="auto">Auto</MenuItem>
                              <MenuItem value="manual">Manual</MenuItem>
                            </Select>
                          </FormControl>
                          {seg.reset_on_period_flip !== undefined && (
                            <TextField
                              size="small"
                              label="Reset #"
                              type="number"
                              value={seg.period_start_number ?? 1}
                              onChange={(e) => updateSegment(i, { period_start_number: parseInt(e.target.value) || 1 })}
                              sx={{ width: 80, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          )}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={seg.reset_on_period_flip || false}
                                onChange={(e) => updateSegment(i, { reset_on_period_flip: e.target.checked, period_start_number: e.target.checked ? (seg.period_start_number || 1) : undefined })}
                              />
                            }
                            label="Reset"
                            sx={{ '& .MuiTypography-root': { fontSize: 13 } }}
                          />
                        </>
                      )}
                      <IconButton size="small" onClick={() => removeSegment(i)} color="error" sx={{ mt: 0.5 }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Preview: <Typography component="span" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{formatPreview(form.segments)}</Typography>
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
              <Button startIcon={<Add />} size="small" onClick={addSegment} sx={{ mt: 1.5, borderRadius: 3 }}>
                Add Segment
              </Button>
            </Box>

            <TextField
              label="Starting Number"
              type="number"
              value={form.starting_number}
              onChange={(e) => setForm({ ...form, starting_number: parseInt(e.target.value) || 1 })}
              sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Box>
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handlePreview}
                disabled={!form.entity_type || loading}
                sx={{ borderRadius: 3, fontWeight: 'bold' }}
              >
                Preview
              </Button>
              {previewResult && (
                <Alert severity="info" sx={{ mt: 1.5, borderRadius: 3 }} icon={<ContentCopy fontSize="small" />}>
                  Generated format: <strong>{previewResult}</strong>
                </Alert>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 'bold' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ borderRadius: 3, px: 4, fontWeight: 'bold' }}
            disabled={loading || !form.entity_type || !form.name}
          >
            {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} PaperProps={{ sx: { borderRadius: 5, p: 1 } }} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: '900' }}>
          History: {historyConfig?.name || ''}
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
            {historyConfig?.entity_type} &middot; {formatPreview(historyConfig?.segments || [])}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : historyItems.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No numbers generated yet.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sequence</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Generated At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyItems.map((h) => (
                    <TableRow key={h.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{h.number_generated}</TableCell>
                      <TableCell>{h.sequence_value}</TableCell>
                      <TableCell>{h.period_key || <Typography variant="body2" color="text.secondary">—</Typography>}</TableCell>
                      <TableCell>{new Date(h.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setHistoryOpen(false)} sx={{ fontWeight: 'bold' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
