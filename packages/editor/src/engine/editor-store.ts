// ─── Editor Store ────────────────────────────────────────────────────────────
// React Context + useReducer state management.

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  EditorState,
  EditorAction,
  EmailDocument,
  EmailNode,
  NodeId,
  EditorMode,
} from "../types";
import {
  updateNode as updateNodeOp,
  addNode as addNodeOp,
  removeNode as removeNodeOp,
  moveNode as moveNodeOp,
  findNode,
  createEmptyDocument,
} from "./operations";

// ─── Reducer ─────────────────────────────────────────────────────────────────

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_DOCUMENT":
      return {
        ...state,
        document: action.payload,
        selectedNodeId: null,
        isDirty: false,
      };

    case "SELECT_NODE":
      return {
        ...state,
        selectedNodeId: action.payload,
      };

    case "UPDATE_NODE":
      return {
        ...state,
        document: {
          ...state.document,
          body: updateNodeOp(state.document.body, action.payload.id, action.payload.props),
        },
        isDirty: true,
      };

    case "ADD_NODE":
      return {
        ...state,
        document: {
          ...state.document,
          body: addNodeOp(
            state.document.body,
            action.payload.parentId,
            action.payload.node,
            action.payload.index
          ),
        },
        selectedNodeId: action.payload.node.id,
        isDirty: true,
      };

    case "DELETE_NODE": {
      const newSelectedId =
        state.selectedNodeId === action.payload ? null : state.selectedNodeId;
      return {
        ...state,
        document: {
          ...state.document,
          body: removeNodeOp(state.document.body, action.payload),
        },
        selectedNodeId: newSelectedId,
        isDirty: true,
      };
    }

    case "MOVE_NODE":
      return {
        ...state,
        document: {
          ...state.document,
          body: moveNodeOp(
            state.document.body,
            action.payload.nodeId,
            action.payload.newParentId,
            action.payload.index
          ),
        },
        isDirty: true,
      };

    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
      };

    case "MARK_CLEAN":
      return {
        ...state,
        isDirty: false,
      };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export interface EditorProviderProps {
  /** Initial document to load */
  initialDocument?: EmailDocument;
  /** Callback when document changes */
  onChange?: (document: EmailDocument) => void;
  children?: ReactNode;
}

export function EditorProvider({
  initialDocument,
  onChange,
  children,
}: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, {
    document: initialDocument ?? createEmptyDocument(),
    selectedNodeId: null,
    mode: "visual" as EditorMode,
    isDirty: false,
  });

  const wrappedDispatch = useCallback(
    (action: EditorAction) => {
      dispatch(action);
      if (onChange && ["UPDATE_NODE", "ADD_NODE", "DELETE_NODE", "MOVE_NODE"].includes(action.type)) {
        const newState = editorReducer(state, action);
        onChange(newState.document);
      }
    },
    [onChange, state]
  );

  const value = useMemo(
    () => ({ state, dispatch: wrappedDispatch }),
    [state, wrappedDispatch]
  );

  return React.createElement(EditorContext.Provider, { value }, children);
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Access the full editor state and dispatch */
export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within an <EditorProvider>");
  }

  const { state, dispatch } = ctx;

  const actions = useMemo(
    () => ({
      /** Set the entire document */
      setDocument: (doc: EmailDocument) =>
        dispatch({ type: "SET_DOCUMENT", payload: doc }),

      /** Select a node by ID */
      selectNode: (id: NodeId | null) =>
        dispatch({ type: "SELECT_NODE", payload: id }),

      /** Update a node's props */
      updateNode: (id: NodeId, props: Record<string, unknown>) =>
        dispatch({ type: "UPDATE_NODE", payload: { id, props } }),

      /** Add a new node as a child of parentId */
      addNode: (parentId: NodeId, node: EmailNode, index?: number) =>
        dispatch({ type: "ADD_NODE", payload: { parentId, node, index } }),

      /** Delete a node by ID */
      deleteNode: (id: NodeId) =>
        dispatch({ type: "DELETE_NODE", payload: id }),

      /** Move a node to a new parent */
      moveNode: (nodeId: NodeId, newParentId: NodeId, index?: number) =>
        dispatch({ type: "MOVE_NODE", payload: { nodeId, newParentId, index } }),

      /** Switch editor mode */
      setMode: (mode: EditorMode) =>
        dispatch({ type: "SET_MODE", payload: mode }),

      /** Mark the document as clean (saved) */
      markClean: () => dispatch({ type: "MARK_CLEAN" }),
    }),
    [dispatch]
  );

  return {
    /** Current editor state */
    ...state,
    /** Editor action creators */
    ...actions,
    /** Raw dispatch for custom actions */
    dispatch,
  };
}

/** Get the currently selected node */
export function useSelectedNode(): EmailNode | null {
  const { document, selectedNodeId } = useEditor();
  if (!selectedNodeId) return null;
  return findNode(document.body, selectedNodeId);
}

/** Get a specific node by ID */
export function useNode(nodeId: NodeId): EmailNode | null {
  const { document } = useEditor();
  return findNode(document.body, nodeId);
}
