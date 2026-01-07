export default function Loading() {
  // Or a custom loading skeleton component
  //return <LoadingSkeleton />
  return <div className="loading">
    <div className="loader-container">
      <p>Loading...</p>
      <div className="loader"></div>
    </div>
  </div>
}
