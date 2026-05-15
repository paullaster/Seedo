import { Alert, Box } from '@mui/material';
import { bffGet } from '@/app/lib/bff';
import InventoryView from './InventoryView';

export const dynamic = 'force-dynamic';

export default async function AgentInventoryPage() {
  let collections: any[] = [];
  let fetchError: string | null = null;

  try {
    const data = await bffGet<any[]>('/collections');
    collections = Array.isArray(data) ? data : [];
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Failed to load inventory';
  }

  if (fetchError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{fetchError}</Alert>
      </Box>
    );
  }

  return <InventoryView initialCollections={collections} />;
}
