import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Chapter } from '@prisma/client';
import { SortableItem } from './sortable-item';

interface ChaptersListProps {
  items: Chapter[];
  isUpdating: boolean;
  onEdit: (id: string) => void;
  onReorder: (updatedOrder: { id: string; position: number }[]) => void;
}

const ChaptersList = ({
  items,
  onEdit,
  isUpdating,
  onReorder,
}: ChaptersListProps) => {
  const [isClient, setIsClient] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    let updatedOrder;

    if (over && active.id !== over.id) {
      setChapters((prevChapters) => {
        const oldIndex = prevChapters.findIndex(
          (item) => item.id === active.id,
        );
        const newIndex = prevChapters.findIndex((item) => item.id === over.id);
        const updatedChapters = arrayMove(prevChapters, oldIndex, newIndex);

        updatedOrder = updatedChapters.map((chapter, index) => ({
          id: chapter.id,
          position: ++index,
        }));

        return updatedChapters;
      });

      if (updatedOrder) {
        onReorder(updatedOrder);
      }
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
        {chapters.map((chapter) => (
          <SortableItem
            key={chapter.id}
            chapter={chapter}
            onEdit={onEdit}
            isUpdating={isUpdating}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default ChaptersList;