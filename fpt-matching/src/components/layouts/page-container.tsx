import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea>
          <div className="py-4">{children}</div>
        </ScrollArea>
      ) : (
        <div className="py-4">{children}</div>
      )}
    </>
  );
}
