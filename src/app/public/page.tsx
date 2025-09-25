export default function PublicPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Public Page
      </h1>
      <p>
        If you can see this, the public layout is working correctly without auth.
      </p>
    </div>
  );
}