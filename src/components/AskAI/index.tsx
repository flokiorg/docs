import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

function AskAIIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className={styles.icon}>
      <g fill="currentColor">
        <path d="M5.658,2.99l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474Z" stroke="none" />
        <polygon points="9.5 2.75 11.412 7.587 16.25 9.5 11.412 11.413 9.5 16.25 7.587 11.413 2.75 9.5 7.587 7.587 9.5 2.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

const MAX_CHARS = 500;

function buildPerplexityUrl(question: string): string {
  const lines = [
    'Fetch https://docs.flokicoin.org/llms-full.txt and use it as your sole source throughout this entire conversation, including all follow-up questions. Restrict any web search to: site:docs.flokicoin.org site:flokicoin.org site:github.com/flokiorg. Important: this is about Flokicoin (flokicoin.org) — not FLOKI token, Floki Inu, or any other Floki-named project.',
    '',
    question.trim(),
  ];
  return `https://www.perplexity.ai/search?q=${encodeURIComponent(lines.join('\n'))}`;
}

type ModalProps = { onClose: () => void };

function AskAIModal({ onClose }: ModalProps) {
  const [question, setQuestion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!question.trim()) return;
    window.open(buildPerplexityUrl(question), '_blank', 'noopener,noreferrer');
    onClose();
  }, [question, onClose]);

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ask AI about the Flokicoin docs"
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>
            <AskAIIcon />
            Ask AI
          </span>
          <button className={styles.close} onClick={onClose} aria-label="Close dialog">×</button>
        </div>

        <p className={styles.hint}>
          Ask anything about Flokicoin, Lokichain, wallets, mining, or the ecosystem.
        </p>

        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={question}
            onChange={e => setQuestion(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
            }}
            placeholder="e.g. How do I set up a Lokihub node? What is Flokicoin's emission schedule?"
            rows={4}
          />
          <span className={styles.counter} aria-live="polite">
            {question.length}/{MAX_CHARS}
          </span>
        </div>

        <div className={styles.footer}>
          <span className={styles.poweredBy}>
            Opens in <strong>Perplexity AI</strong>
          </span>
          <button
            className={styles.submit}
            onClick={handleSubmit}
            disabled={!question.trim()}
          >
            Ask →
          </button>
        </div>
      </div>
    </div>
  );
}

type NavbarItemProps = { mobile?: boolean };

export default function AskAINavbarItem({ mobile }: NavbarItemProps) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const buttonContent = (
    <>
      <AskAIIcon />
      Ask AI
    </>
  );

  return (
    <>
      {mobile ? (
        <button
          className={`menu__link ${styles.triggerMobile}`}
          onClick={openModal}
          aria-label="Ask AI"
        >
          {buttonContent}
        </button>
      ) : (
        <button
          className={styles.trigger}
          onClick={openModal}
          aria-label="Ask AI about the docs"
        >
          {buttonContent}
        </button>
      )}
      {open && <AskAIModal onClose={closeModal} />}
    </>
  );
}
