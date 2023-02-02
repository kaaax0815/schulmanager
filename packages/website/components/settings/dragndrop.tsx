import { createStyles, Group, Switch, Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { IconGripVertical } from '@tabler/icons';
import { useEffect } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { StrictModeDroppable } from './strictModeDroppable';

const useStyles = createStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm
  },

  itemDragging: {
    boxShadow: theme.shadows.sm
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md
  }
}));

export interface DragNDropProps {
  settings: {
    id: string;
    name: string;
    position: string;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturnType<any>;
}

export default function DragNDrop(props: DragNDropProps) {
  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(props.settings);

  useEffect(() => {
    for (const [index, item] of state.entries()) {
      if (props.form.values[item.position] !== index) {
        props.form.setFieldValue(item.position, index);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        handlers.reorder({ from: source.index, to: destination?.index || 0 });
      }}
    >
      <StrictModeDroppable droppableId="modules">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {state.map((item, index) => (
              <Draggable key={item.id} index={index} draggableId={item.id}>
                {(provided, snapshot) => (
                  <div
                    className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div {...provided.dragHandleProps} className={classes.dragHandle}>
                      <IconGripVertical size={18} stroke={1.5} />
                    </div>
                    <Group align="center" position="apart">
                      <Text>{item.name}</Text>
                      <Switch
                        aria-label={item.name}
                        {...props.form.getInputProps(item.id, { type: 'checkbox' })}
                      />
                    </Group>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
