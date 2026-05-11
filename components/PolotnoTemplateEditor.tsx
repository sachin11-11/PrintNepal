"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Workspace } from "polotno/canvas/workspace";
import { createStore } from "polotno/model/store";
import { PagesTimeline } from "polotno/pages-timeline";
import { SidePanel } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import type { TemplateEditorHandle, TemplateEditorValue } from "./TemplateEditor";
import { templateToPolotnoJSON } from "@/lib/templates/polotno";

type PolotnoTemplateEditorProps = {
  template: TemplateEditorValue;
  editorHandleRef: MutableRefObject<TemplateEditorHandle | null>;
  onReady?: () => void;
};

type PolotnoStore = ReturnType<typeof createStore>;

function findElementByField(store: PolotnoStore, field: string) {
  for (const page of store.pages) {
    const element = page.children.find((child: any) => child.custom?.field === field);
    if (element) return element as any;
  }

  return null;
}

function usePolotnoStore(template: TemplateEditorValue) {
  const storeRef = useRef<PolotnoStore | null>(null);
  const initialJson = useMemo(() => templateToPolotnoJSON(template), [template]);

  if (!storeRef.current) {
    storeRef.current = createStore({
      key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || "",
      showCredit: true
    });
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;
    store.loadJSON(initialJson);
    store.history.clear();
  }, [initialJson]);

  return storeRef.current;
}

export function PolotnoTemplateEditor({ template, editorHandleRef, onReady }: PolotnoTemplateEditorProps) {
  const store = usePolotnoStore(template);
  const hasApiKey = Boolean(process.env.NEXT_PUBLIC_POLOTNO_API_KEY);

  useEffect(() => {
    if (!store) return;

    editorHandleRef.current = {
      async exportPng() {
        await store.waitLoading();
        return store.toDataURL({
          mimeType: "image/png",
          pixelRatio: 2,
          dpi: 300,
          dpiMetadata: "always"
        });
      },
      exportJson() {
        return store.toJSON();
      },
      updateField(field, value) {
        const element = findElementByField(store, field);
        if (!element) return;

        if (field === "color") {
          element.set({ fill: value });
          return;
        }

        if (element.type === "text") {
          element.set({ text: value });
        }
      },
      replaceImage(field, dataUrl) {
        const element = findElementByField(store, field);
        if (!element || element.type !== "image") return;
        element.set({
          src: dataUrl,
          cropX: 0,
          cropY: 0,
          cropWidth: 1,
          cropHeight: 1
        });
      }
    };

    onReady?.();

    return () => {
      editorHandleRef.current = null;
    };
  }, [editorHandleRef, onReady, store]);

  return (
    <div className="relative min-h-[46rem] overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      {!hasApiKey ? (
        <div className="absolute left-4 top-4 z-20 max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900 shadow-sm">
          Add <code>NEXT_PUBLIC_POLOTNO_API_KEY</code> to <code>.env.local</code> for the licensed Polotno editor. Without it, Polotno may show development warnings.
        </div>
      ) : null}
      <PolotnoContainer style={{ width: "100%", height: "46rem" }}>
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} downloadButtonEnabled />
          <Workspace store={store} />
          <ZoomButtons store={store} />
          <PagesTimeline store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
}

export default PolotnoTemplateEditor;
