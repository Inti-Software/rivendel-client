export function handleKeyDown(event, onAccept, onCancel) {
  if (event.key === 'Enter') onAccept(event);
  if (event.key === 'Escape') onCancel(event);
}
