import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Pagination, Alert } from '@mui/material';
import { fetchNotifications } from '../services/api';
import { NotificationCard } from '../components/NotificationCard';
import type { Notification } from '../utils/prioritySort';
import { Log } from '../utils/logger';

export const AllNotifications = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let isActive = true; // basic cleanup to stop weird react state errors

    const getNotifs = async () => {
      try {
        setLoading(true);
        Log('frontend', 'info', 'page', `Fetching pg ${page}`);
        
        // standard limit is 10 for pagination
        const queryParams: any = { page, limit: 10 };
        if (filter !== 'all') {
          queryParams.notification_type = filter;
        }
        
        const data = await fetchNotifications(queryParams);
        
        if (isActive) {
          setNotifs(data);
          setErrMessage(null);
        }
      } catch (err: any) {
        if (isActive) {
          const apiError = err?.response?.data?.message || err?.message || 'Failed to grab notifications';
          setErrMessage(`API Error: ${apiError}. Please ensure you have added a valid token to localStorage or api.ts`);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    getNotifs();

    return () => {
      isActive = false;
    };
  }, [page, filter]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          All Notifications
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filter}
            label="Filter By"
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1); // reset to page 1 so we don't end up on an empty page
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {errMessage && <Alert severity="error" sx={{ mb: 3 }}>{errMessage}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {notifs.length === 0 && !errMessage ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 10 }}>
              No notifications right now. Check back later.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {notifs.map(n => (
                <Box key={n.ID}>
                  <NotificationCard notification={n} />
                </Box>
              ))}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Pagination 
              count={10} 
              page={page} 
              onChange={(_, val) => setPage(val)} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Box>
  );
};
