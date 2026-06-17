import axios from 'axios';
import { Log } from '../utils/logger';
import type { Notification } from '../utils/prioritySort';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    "ID": "ea836726-c25e-4f21-a72f-544a6af8a37f",
    "Type": "Result",
    "Message": "project-review",
    "Timestamp": "2026-04-22 17:50:42"
  },
  {
    "ID": "003cb427-8fc6-47f7-bb00-be228f6b0d2c",
    "Type": "Result",
    "Message": "external",
    "Timestamp": "2026-04-22 17:50:30"
  },
  {
    "ID": "e5c4ff20-31bf-4d40-8f02-72fda59e8918",
    "Type": "Result",
    "Message": "project review",
    "Timestamp": "2026-04-22 17:50:18"
  },
  {
    "ID": "1cfce5ee-ad37-4894-8946-d707627176a5",
    "Type": "Event",
    "Message": "tech-fest",
    "Timestamp": "2026-04-22 17:50:06"
  },
  {
    "ID": "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8",
    "Type": "Result",
    "Message": "project-review",
    "Timestamp": "2026-04-22 17:49:54"
  },
  {
    "ID": "8a7412bd-6065-4d09-8501-a37f11cc848b",
    "Type": "Placement",
    "Message": "Advanced Micro Devices Inc. hiring",
    "Timestamp": "2026-04-22 17:49:42"
  }
];

export const fetchNotifications = async (params: any = {}): Promise<Notification[]> => {
  try {
    Log('frontend', 'info', 'api', 'Pulling notifications');
    
    // grab token from local storage
    const token = localStorage.getItem('access_token') || 'YOUR_TOKEN_HERE';

    const res = await axios.get('http://4.224.186.213/evaluation-service/notifications', {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return res.data?.notifications || res.data || [];
  } catch (err: any) {
    const errorMsg = err?.response?.data?.message || err?.message || 'API pull failed';
    Log('frontend', 'warn', 'api', `Falling back to mock data due to: ${errorMsg}`);
    
    // Fall back to mock data if the API throws 401 Unauthorized
    let filtered = [...MOCK_NOTIFICATIONS];
    if (params.notification_type && params.notification_type !== 'all') {
      filtered = filtered.filter(n => n.Type.toLowerCase() === params.notification_type.toLowerCase());
    }
    
    return filtered;
  }
};
