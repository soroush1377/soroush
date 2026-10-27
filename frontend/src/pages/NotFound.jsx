import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-20 text-center lg:py-28">
      <p className="section-label">Error 404</p>
      <h1 className="mx-auto mt-5 max-w-2xl text-display-lg">This page could not be found</h1>
      <p className="mx-auto mt-5 max-w-xl text-body-lg text-ink-soft">
        The link may be out of date. Browse our current properties, or head back to the homepage.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button to="/properties" icon="arrowRight">
          Browse properties
        </Button>
        <Button to="/" variant="outline">
          Back to home
        </Button>
      </div>
    </div>
  );
}
