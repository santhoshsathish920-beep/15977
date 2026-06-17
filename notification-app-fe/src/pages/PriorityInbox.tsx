import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { fetchNotifications } from '../services/api';
import { NotificationCard } from '../components/NotificationCard';
import { getPriorityInbox } from '../utils/prioritySort';
import type { Notification } from '../utils/prioritySort';
import { useNotificationContext } from '../context/NotificationContext';
import { Log } from '../utils/logger';

export const PriorityInbox = () => {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [topN, setTopN] = useState(10);
  
  const { checkRead } = useNotificationContext();

  useEffect(() => {
    let isActive = true;

    const pullTopNotifs = async () => {
      try {
        setLoading(true);
        Log('frontend', 'info', 'page', `Fetching inbox stream for top ${topN}`);
        
        // grabbing a huge chunk of data to simulate a live stream of unread stuff
        const data = await fetchNotifications({ limit: 100, page: 1 });
        
        if (isActive) {
          setNotifs(data);
          setErrMessage(null);
        }
      } catch (err: any) {
        if (isActive) {
          const apiError = err?.response?.data?.message || err?.message || 'Failed to pull priority items';
          setErrMessage(`API Error: ${apiError}. Please add your valid token.`);
          Log('frontend', 'error', 'page', err?.message || 'Inbox fetch broke');
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    pullTopNotifs();

    return () => {
      isActive = false;
    };
  }, []);

  const topPriorityList = useMemo(() => {
    // filter out the ones the user already clicked
    const unreadOnly = notifs.filter(n => !checkRead(n.ID));
    // pass to our custom sort function
    return getPriorityInbox(unreadOnly, topN);
  }, [notifs, checkRead, topN]);

  // early return if we hit an error so it doesn't try to render the rest
  if (errMessage) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Alert severity="error">{errMessage}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Priority Inbox
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Show Top</InputLabel>
          <Select
            value={topN}
            label="Show Top"
            onChange={(e) => setTopN(Number(e.target.value))}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : topPriorityList.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 10 }}>
          You're all caught up! No priority items left.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {topPriorityList.map((item) => (
            <Box key={item.ID}>
              <NotificationCard notification={item} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
