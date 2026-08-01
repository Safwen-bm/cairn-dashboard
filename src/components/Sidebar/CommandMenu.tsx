import { Command } from 'cmdk';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { FiEye, FiLink, FiLogOut, FiPhone, FiPlus } from 'react-icons/fi';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';

export const CommandMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState('');

  // Disable body scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="fixed inset-0 bg-stone-950/50 flex items-start justify-center pt-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Required Title for Accessibility */}
        <DialogTitle className="sr-only">Command Menu</DialogTitle>

        {/* Command Menu Container */}
        <div className="bg-white rounded-lg shadow-xl border-stone-300 border overflow-hidden w-full max-w-lg mx-auto">
          <Command>
            <Command.Input
              value={value}
              onValueChange={setValue}
              placeholder="What do you need?"
              className="relative border-b border-stone-300 p-3 text-lg w-full placeholder:text-stone-400 focus:outline-none"
            />
            <Command.List>
              <Command.Empty>
                No results found for{' '}
                <span className="text-violet-500">"{value}"</span>
              </Command.Empty>

              <Command.Group heading="Team" className="text-sm mb-3 text-stone-400">
                <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
                  <FiPlus />
                  Invite Member
                </Command.Item>
                <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
                  <FiEye />
                  See Org Chart
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Integrations" className="text-sm mb-3 text-stone-400">
                <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
                  <FiLink />
                  Link Services
                </Command.Item>
                <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
                  <FiPhone />
                  Contact Support
                </Command.Item>
              </Command.Group>

              <Command.Item className="flex cursor-pointer transition-colors p-2 text-sm text-stone-50 hover:bg-stone-700 bg-stone-950 rounded items-center gap-2">
                <FiLogOut />
                Sign Out
              </Command.Item>
            </Command.List>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};