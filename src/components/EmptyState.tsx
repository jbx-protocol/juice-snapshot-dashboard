import blueberryImg from "../assets/blueberry.png";

export default function EmptyState({
  governanceProcessLink,
}: {
  governanceProcessLink?: string;
}) {
  return (
    <div>
      <img
        src={blueberryImg}
        alt="Blueberry"
        style={{ maxWidth: "300px", width: "100%", height: "auto" }}
      />
      <h3>There are no active proposals.</h3>
      <p>
        Come back when the next voting period starts.{" "}
        {governanceProcessLink && (
          <a
            href={governanceProcessLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more.
          </a>
        )}
      </p>
    </div>
  );
}
