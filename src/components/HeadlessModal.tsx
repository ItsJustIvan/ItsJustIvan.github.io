// src/components/HeadlessModal.tsx (or whatever you name it)
import { Dialog } from '@headlessui/react';
import { useState, Fragment, useEffect } from 'react'; // Import useEffect

// Define the types for the props of the internal HeadlessModal
interface HeadlessModalProps {
  isOpen: boolean;
  closeModal: () => void;
  // openModal: () => void; // Not needed as a prop here if controlled by parent state/events
  children: React.ReactNode; // For the content passed into the modal
}

export function HeadlessModal({ isOpen, closeModal, children }: HeadlessModalProps) {
  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-[1000]">
      {/* The backdrop */}
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-3xl font-bold leading-none"
            aria-label="Close"
          >
            &times;
          </button>

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Define props for the wrapper component
interface ContactModalWrapperProps {
  children: React.ReactNode;
}

export default function ContactModalWrapper({ children }: ContactModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => { // Use useEffect instead of useState for side effects
    if (typeof window !== 'undefined') {
      const buttons = document.querySelectorAll('[data-modal-target="contactModal"]');
      buttons.forEach(button => {
        button.addEventListener('click', openModal);
      });

      // Cleanup function for event listeners
      return () => {
        buttons.forEach(button => {
          button.removeEventListener('click', openModal);
        });
      };
    }
  }, []); // Empty dependency array means it runs once on mount/cleanup on unmount

  return (
    <HeadlessModal isOpen={isOpen} closeModal={closeModal}>
      {children}
    </HeadlessModal>
  );
}