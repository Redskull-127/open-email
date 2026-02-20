import type { EmailNode, EmailDocument, NodeId } from "../types";
import { nanoid } from "nanoid";

export function generateId(): string {
  return nanoid(10);
}

export function createNode(
  type: EmailNode["type"],
  props: Record<string, unknown> = {},
  children?: EmailNode[],
  id?: string
): EmailNode {
  return {
    id: id || generateId(),
    type,
    props,
    ...(children ? { children } : {}),
  };
}

export function cloneNode(node: EmailNode): EmailNode {
  return {
    ...node,
    id: generateId(),
    props: { ...node.props },
    children: node.children?.map(cloneNode),
  };
}

export function findNode(root: EmailNode, nodeId: NodeId): EmailNode | null {
  if (root.id === nodeId) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}

export function findParent(root: EmailNode, nodeId: NodeId): EmailNode | null {
  if (root.children) {
    for (const child of root.children) {
      if (child.id === nodeId) return root;
      const found = findParent(child, nodeId);
      if (found) return found;
    }
  }
  return null;
}

export function getNodePath(root: EmailNode, nodeId: NodeId): NodeId[] {
  if (root.id === nodeId) return [root.id];
  if (root.children) {
    for (const child of root.children) {
      const childPath = getNodePath(child, nodeId);
      if (childPath.length > 0) return [root.id, ...childPath];
    }
  }
  return [];
}

export function updateNode(
  root: EmailNode,
  nodeId: NodeId,
  newProps: Record<string, unknown>
): EmailNode {
  if (root.id === nodeId) {
    return {
      ...root,
      props: { ...root.props, ...newProps },
    };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) => updateNode(child, nodeId, newProps)),
    };
  }
  return root;
}

export function addNode(
  root: EmailNode,
  parentId: NodeId,
  node: EmailNode,
  index?: number
): EmailNode {
  if (root.id === parentId) {
    const children = root.children ? [...root.children] : [];
    if (index !== undefined && index >= 0 && index <= children.length) {
      children.splice(index, 0, node);
    } else {
      children.push(node);
    }
    return { ...root, children };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) => addNode(child, parentId, node, index)),
    };
  }
  return root;
}

export function removeNode(root: EmailNode, nodeId: NodeId): EmailNode {
  if (root.children) {
    const filtered = root.children.filter((child) => child.id !== nodeId);
    return {
      ...root,
      children: filtered.map((child) => removeNode(child, nodeId)),
    };
  }
  return root;
}

export function moveNode(
  root: EmailNode,
  nodeId: NodeId,
  newParentId: NodeId,
  index?: number
): EmailNode {
  const node = findNode(root, nodeId);
  if (!node) return root;

  const withoutNode = removeNode(root, nodeId);
  return addNode(withoutNode, newParentId, node, index);
}

export function flattenTree(root: EmailNode): EmailNode[] {
  const result: EmailNode[] = [root];
  if (root.children) {
    for (const child of root.children) {
      result.push(...flattenTree(child));
    }
  }
  return result;
}

export function validateDocument(doc: EmailDocument): string[] {
  const errors: string[] = [];

  if (doc.version !== 1) {
    errors.push(`Unsupported document version: ${doc.version}`);
  }
  if (!doc.meta?.title) {
    errors.push("Document must have a title");
  }
  if (!doc.body) {
    errors.push("Document must have a body");
  }

  const allNodes = flattenTree(doc.body);
  const ids = new Set<string>();
  for (const node of allNodes) {
    if (ids.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    ids.add(node.id);
  }

  return errors;
}

export function createEmptyDocument(title = "Untitled Email"): EmailDocument {
  return {
    version: 1,
    meta: {
      title,
      tailwind: { enabled: true },
      fonts: [],
    },
    body: createNode("container", { maxWidth: "600px" }, [
      createNode("section", {}, [
        createNode("text", { content: "Start building your email..." }),
      ]),
    ]),
  };
}
