import { ArrowUpRight, MessageCircle, Radio } from "lucide-react";
import { INTRO_SLIDES } from "../../shared/introduction";

export function WorkshopIntroduction({
  slideIndex,
  isHost,
}: {
  slideIndex: number;
  isHost: boolean;
}) {
  const slide = INTRO_SLIDES[slideIndex];
  return (
    <section className="intro-slide" aria-labelledby="intro-slide-heading">
      <div className="intro-slide-meta">
        <span className="eyebrow">{slide.section}</span>
        <span className="intro-slide-count" role="status">
          Folie {String(slideIndex + 1).padStart(2, "0")}
          <span> / {String(INTRO_SLIDES.length).padStart(2, "0")}</span>
        </span>
      </div>
      <div className="intro-progress" aria-hidden="true">
        {INTRO_SLIDES.map((item, index) => (
          <span
            key={item.title}
            className={index === slideIndex ? "is-current" : index < slideIndex ? "is-complete" : ""}
          />
        ))}
      </div>
      <h2 id="intro-slide-heading">{slide.title}</h2>
      <p className="intro-lead">{slide.lead}</p>
      <div className={`intro-cards intro-cards-${slide.cards.length}`}>
        {slide.cards.map((card, index) => (
          <article className="intro-card" key={card.title}>
            {slide.numbered && <span className="intro-card-number" aria-hidden="true">{index + 1}</span>}
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
      {slide.board && (
        <figure className="intro-board">
          <figcaption>Beispiel für ein Sprintboard · jede Karte ist eine eigene Story</figcaption>
          <div className="intro-board-columns">
            {slide.board.map((column) => (
              <div className="intro-board-column" key={column.title}>
                <h3>{column.title}</h3>
                <p>{column.item}</p>
              </div>
            ))}
          </div>
        </figure>
      )}
      <p className="intro-takeaway">{slide.takeaway}</p>
      <div className="intro-prompt">
        <MessageCircle size={18} aria-hidden="true" />
        <p><span>Kurz in die Runde</span>{slide.prompt}</p>
      </div>
      <footer className="intro-slide-footer">
        <span><Radio size={14} aria-hidden="true" /> {isHost ? "Du führst die Runde durch die Folien" : "Die Moderation blättert für alle weiter"}</span>
        {slide.source && (
          <a href={slide.source.href} target="_blank" rel="noreferrer">
            {slide.source.label} <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </footer>
    </section>
  );
}
