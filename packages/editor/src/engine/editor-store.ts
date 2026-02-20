import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useEffect,
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

    case "UPDATE_VARIABLES":
      return {
        ...state,
        document: {
          ...state.document,
          variables: action.payload,
        },
        isDirty: true,
      };

    case "UPDATE_DOCUMENT_META":
      return {
        ...state,
        document: {
          ...state.document,
          meta: { ...state.document.meta, ...action.payload },
        },
        isDirty: true,
      };

    case "CREATE_VARIABLE_AND_UPDATE_NODE":
      return {
        ...state,
        document: {
          ...state.document,
          variables: action.payload.variables,
          body: updateNodeOp(state.document.body, action.payload.nodeId, {
            [action.payload.contentKey]: action.payload.newContent,
          }),
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

interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export interface EditorProviderProps {
  initialDocument?: EmailDocument;
  onChange?: (document: EmailDocument) => void;
  children?: ReactNode;
}

const DIRTY_ACTIONS = new Set([
  "SET_DOCUMENT",
  "UPDATE_NODE",
  "ADD_NODE",
  "DELETE_NODE",
  "MOVE_NODE",
  "UPDATE_VARIABLES",
  "UPDATE_DOCUMENT_META",
  "CREATE_VARIABLE_AND_UPDATE_NODE",
]);

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

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const wrappedDispatch = useCallback(
    (action: EditorAction) => {
      dispatch(action);
      if (onChange && DIRTY_ACTIONS.has(action.type)) {
        const newState = editorReducer(stateRef.current, action);
        onChange(newState.document);
      }
    },
    [onChange]
  );

  const value = useMemo(
    () => ({ state, dispatch: wrappedDispatch }),
    [state, wrappedDispatch]
  );

  return React.createElement(EditorContext.Provider, { value }, children);
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within an <EditorProvider>");
  }

  const { state, dispatch } = ctx;

  const actions = useMemo(
    () => ({
      setDocument: (doc: EmailDocument) =>
        dispatch({ type: "SET_DOCUMENT", payload: doc }),
      selectNode: (id: NodeId | null) =>
        dispatch({ type: "SELECT_NODE", payload: id }),
      updateNode: (id: NodeId, props: Record<string, unknown>) =>
        dispatch({ type: "UPDATE_NODE", payload: { id, props } }),
      addNode: (parentId: NodeId, node: EmailNode, index?: number) =>
        dispatch({ type: "ADD_NODE", payload: { parentId, node, index } }),
      deleteNode: (id: NodeId) =>
        dispatch({ type: "DELETE_NODE", payload: id }),
      moveNode: (nodeId: NodeId, newParentId: NodeId, index?: number) =>
        dispatch({ type: "MOVE_NODE", payload: { nodeId, newParentId, index } }),
      updateVariables: (variables: Record<string, { fallback: string }>) =>
        dispatch({ type: "UPDATE_VARIABLES", payload: variables }),
      updateDocumentMeta: (meta: Partial<EmailDocument["meta"]>) =>
        dispatch({ type: "UPDATE_DOCUMENT_META", payload: meta }),
      createVariableAndInsert: (
        variables: Record<string, { fallback: string }>,
        nodeId: NodeId,
        contentKey: string,
        newContent: string
      ) =>
        dispatch({
          type: "CREATE_VARIABLE_AND_UPDATE_NODE",
          payload: { variables, nodeId, contentKey, newContent },
        }),
      setMode: (mode: EditorMode) =>
        dispatch({ type: "SET_MODE", payload: mode }),
      markClean: () => dispatch({ type: "MARK_CLEAN" }),
    }),
    [dispatch]
  );

  return { ...state, ...actions, dispatch };
}

export function useSelectedNode(): EmailNode | null {
  const { document, selectedNodeId } = useEditor();
  if (!selectedNodeId) return null;
  return findNode(document.body, selectedNodeId);
}

export function useNode(nodeId: NodeId): EmailNode | null {
  const { document } = useEditor();
  return findNode(document.body, nodeId);
}

export function useVariables(): Record<string, { fallback: string }> {
  const { document } = useEditor();
  return document.variables ?? {};
}
