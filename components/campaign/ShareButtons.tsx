"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Code2, Copy, Share2, X } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/utils";

const MESSAGES = {
  whatsapp:
    "Minik Defne'ye Umut Ol kampanyasına destek olun — KAMPANYATAKİP'te şeffaf takip:",
  twitter:
    "SMA Tip 1 hastası Minik Defne için Zolgensma tedavisi. Her bağış şeffaf takipte. 🙏",
  facebook:
    "Minik Defne'ye Umut Ol · Şeffaf bağış takipli kampanya · KAMPANYATAKİP",
};

interface ShareButtonsProps {
  className?: string;
  compact?: boolean;
}

export function ShareButtons({ className, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.origin + "/kampanya/demo");
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = async () => {
    const code = `<iframe src="${shareUrl}" width="100%" height="900" frameborder="0" style="border-radius:16px;border:1px solid #c3c6d0;"></iframe>`;
    await navigator.clipboard.writeText(code);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const encoded = encodeURIComponent(shareUrl);

  const iconSize = compact ? 14 : 16;
  const buttonSize = compact ? "h-9 w-9" : "h-10 w-10";

  return (
    <>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {!compact && (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-on-surface-variant mr-1">
            <Share2 size={14} />
            Paylaş:
          </span>
        )}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${MESSAGES.whatsapp} ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp'ta paylaş"
          className={cn(
            "inline-flex items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:border-[#25D366] hover:text-[#25D366] hover:-translate-y-0.5 transition-all",
            buttonSize,
          )}
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M20.52 3.48A12 12 0 003.48 20.52L2 22l1.53-1.44A12 12 0 1020.52 3.48zM12 21.5a9.47 9.47 0 01-4.83-1.33l-.35-.21-3.59.94.96-3.5-.23-.36A9.5 9.5 0 1112 21.5zm5.23-7.1c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.2.28-.74.91-.9 1.1-.17.19-.33.21-.61.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.66-1.55-1.94-.17-.28-.02-.44.12-.58.13-.13.28-.33.43-.5.14-.17.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49-.16 0-.36-.02-.55-.02-.19 0-.5.07-.76.36-.26.28-1 .98-1 2.38 0 1.4 1.02 2.76 1.16 2.95.14.19 2 3.06 4.85 4.28.68.29 1.2.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.66-.68 1.9-1.34.23-.66.23-1.22.16-1.34-.07-.12-.26-.19-.53-.33z" />
          </svg>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(MESSAGES.twitter)}&url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X'te paylaş"
          className={cn(
            "inline-flex items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:border-primary-container hover:text-primary-container hover:-translate-y-0.5 transition-all",
            buttonSize,
          )}
        >
          <SocialIcon platform="twitter" size={iconSize} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook'ta paylaş"
          className={cn(
            "inline-flex items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:border-[#1877F2] hover:text-[#1877F2] hover:-translate-y-0.5 transition-all",
            buttonSize,
          )}
        >
          <SocialIcon platform="facebook" size={iconSize} />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Linki kopyala"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:border-secondary hover:text-secondary hover:-translate-y-0.5 transition-all px-3",
            compact ? "h-9 text-[12px]" : "h-10 text-[13px]",
            "font-semibold",
          )}
        >
          {copied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
          {copied ? "Kopyalandı" : "Link"}
        </button>
        {!compact && (
          <button
            type="button"
            onClick={() => setEmbedOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:border-secondary hover:text-secondary hover:-translate-y-0.5 transition-all h-10 px-3 text-[13px] font-semibold"
          >
            <Code2 size={iconSize} />
            Embed
          </button>
        )}
      </div>

      <AnimatePresence>
        {embedOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setEmbedOpen(false)}
              className="absolute inset-0 bg-primary/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className="relative w-full md:max-w-lg bg-white md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setEmbedOpen(false)}
                aria-label="Kapat"
                className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary-container"
              >
                <X size={18} />
              </button>
              <div className="p-7">
                <h3 className="text-[20px] font-semibold text-primary-container tracking-[-0.01em] mb-2">
                  Embed Kodu
                </h3>
                <p className="text-[13px] text-on-surface-variant mb-5">
                  Kampanyayı kendi sitenize gömmek için aşağıdaki iframe
                  kodunu kullanın.
                </p>
                <pre className="text-[12px] text-on-surface leading-[18px] bg-surface-container-low border border-outline-variant rounded-lg p-4 overflow-x-auto">
                  {`<iframe src="${shareUrl}" width="100%" height="900" frameborder="0" style="border-radius:16px;border:1px solid #c3c6d0;"></iframe>`}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[14.5px] font-semibold bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors"
                >
                  {embedCopied ? <Check size={16} /> : <Copy size={16} />}
                  {embedCopied ? "Kopyalandı" : "Kodu Kopyala"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
