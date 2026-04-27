const API_BASE = '/api';

export const api = {
  users: {
    getAll: () => fetch(`${API_BASE}/users`).then(res => res.json()),
    add: (user) => fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' }).then(res => res.json())
  },
  courses: {
    getAll: () => fetch(`${API_BASE}/courses`).then(res => res.json()),
    add: (course) => fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    }).then(res => res.json()),
    updateProgress: (id) => fetch(`${API_BASE}/courses/${id}/progress`, { method: 'PATCH' }).then(res => res.json())
  },
  assignments: {
    getAll: () => fetch(`${API_BASE}/assignments`).then(res => res.json()),
    add: (assignment) => fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment)
    }).then(res => res.json()),
    update: (id, updates) => fetch(`${API_BASE}/assignments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).then(res => res.json()),
    submit: async (id, file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE}/assignments/${id}/submit`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    },
    download: (id) => {
      window.open(`${API_BASE}/assignments/${id}/download`, '_blank');
    },
    downloadSubmittedFile: (id) => {
      window.open(`${API_BASE}/assignments/${id}/file`, '_blank');
    }
  },
  notifications: {
    getAll: () => fetch(`${API_BASE}/notifications`).then(res => res.json()),
    add: (notif) => fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    }).then(res => res.json()),
    markAllRead: () => fetch(`${API_BASE}/notifications/mark-all-read`, { method: 'PATCH' }).then(res => res.json())
  },
  logins: {
    getAll: () => fetch(`${API_BASE}/logins`).then(res => res.json()),
    record: (login) => fetch(`${API_BASE}/logins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
    }).then(res => res.json())
  }
};
