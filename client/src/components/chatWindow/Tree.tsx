"use client"

import React, { useState, useEffect } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


interface TreeNode {
  id: string;
  text: string;
  diamond: boolean;
  pulse: boolean;
  visited: boolean;
  children?: TreeNode[];
}

const treeData: TreeNode[] = [
  {
    id: "1",
    text: "Query",
    diamond: false,
    pulse: false,
    visited: false,
    children: [
      {
        id: "2",
        text: "Supervisor",
        diamond: false,
        pulse: false,
        visited: false,
        children: [
          {
            id: "3",
            text: "Finance",
            diamond: false,
            pulse: false,
            visited: false,
            children: [
              {
                id: "4",
                text: "dbvhd",
                diamond: false,
                pulse: false,
                visited: false,
              },
              {
                id: "5",
                text: "dbvhd",
                diamond: false,
                pulse: false,
                visited: false,
              },
            ],
          },
          {
            id: "5",
            text: "Math",
            diamond: false,
            pulse: false,
            visited: false,
            children: [
              {
                id: "7",
                text: "dbvhd",
                diamond: false,
                pulse: false,
                visited: false,
              },
              {
                id: "6",
                text: "yiiuuih",
                diamond: false,
                pulse: false,
                visited: false,
              },
            ],
          },
          {
            id: "8",
            text: "Research",
            diamond: false,
            pulse: false,
            visited: false,
            children: [
              {
                id: "9",
                text: "dbvhd",
                diamond: false,
                pulse: false,
                visited: false,
              }
            ],
          },
        ],
      },
    ],
  },
];

const Flow: React.FC = () => {
  const [state, setState] = useState<TreeNode[]>([]);
  useEffect(() => {
    mapTree(treeData);
  }, []);
  useEffect(() => {
    console.log(state);
  }, [state]);
  let arr = [];
  // Helper function to map and flatten the tree structure
  const mapTree = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      console.log(node, state);
      // Spread the previous state and add the current node
      setState(prevState => [...prevState, node]);

      if (node.children && node.children.length) {
        mapTree(node.children);
      }
    });
  };

  return <div className="tree overflow-x-auto">{treeRendering(treeData)}</div>;
};

const treeRendering = (treeData: TreeNode[]): JSX.Element => {
  return (
    <>
      <ul >
        {treeData.map((item) => (
          <li key={item.id} className={`${item.text}${item.id}`}>
            {/* <div>{item.id}</div> */}
            <div>
            <HoverCard>
              <HoverCardTrigger>{item.id}</HoverCardTrigger>
              <HoverCardContent>
                The React Framework – created and maintained by @vercel.
              </HoverCardContent>
            </HoverCard>
            </div> 
            {/* Recursively render children if they exist */}
            {item.children && item.children.length > 0
              ? treeRendering(item.children)
              : null}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Flow;
