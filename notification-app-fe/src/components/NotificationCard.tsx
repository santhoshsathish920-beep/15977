import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useNotificationContext } from '../context/NotificationContext';
import type { Notification } from '../utils/prioritySort';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';

const getTypeVisuals = (type: string) => {
  const t = type.toLowerCase();
  if (t === 'placement') return { icon: <WorkIcon fontSize="small" />, color: 'success' as const };
  if (t === 'result') return { icon: <AssessmentIcon fontSize="small" />, color: 'info' as const };
  return { icon: <EventIcon fontSize="small" />, color: 'warning' as const };
};

export const NotificationCard = ({ notification }: { notification: Notification }) => {
  const { checkRead, markRead } = useNotificationContext();
  const read = checkRead(notification.ID);
  const visuals = getTypeVisuals(notification.Type);

  const onCardClick = () => {
    if (!read) markRead(notification.ID);
  };

  return (
    <Card
      onClick={onCardClick}
      sx={{
        mb: 2,
        cursor: read ? 'default' : 'pointer',
        bgcolor: read ? 'background.paper' : 'action.hover',
        borderLeft: read ? '4px solid transparent' : '4px solid #1976d2',
        boxShadow: read ? 1 : 3,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            icon={visuals.icon}
            label={notification.Type}
            color={visuals.color}
            size="small"
            variant={read ? "outlined" : "filled"}
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleDateString()}
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: read ? 400 : 600 }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
};
