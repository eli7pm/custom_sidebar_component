import {useEffect, useRef, useState} from "react";
import CustomSidebarRef from "./CustomSidebarRef"

export default function PdfViewerComponent(props) {
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);
  const [showSidebar, setShowSidebar]  = useState(false)

  useEffect(() => {
    const container = containerRef.current; // This `useRef` instance will render the PDF.
    const sidebar = sidebarRef.current // this useRef will keep track of the Custom Sidebar Node

    let PSPDFKit, instance;

    (async function () {
      PSPDFKit = await import("pspdfkit")

      PSPDFKit.unload(container) // Ensure that there's only one PSPDFKit instance.

      instance = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
        customUI: {
          [PSPDFKit.UIElement.Sidebar]: {
            [PSPDFKit.SidebarMode.CUSTOM]({ containerNode }) {
              containerNode.appendChild(sidebar);
              return {
                node: containerNode
              };
            }
          }
        }
      });
      const sidebarButton = {
        type: "custom",
        id: "my-button",
        title: "My Button",
        dropdownGroup: "sidebar",
        onPress: (event) => {
          instance.setViewState(viewState=>viewState.set("sidebarMode", "CUSTOM"));
          //use state variable to make sure the component displays inside the sidebar and not on the main DOM
          showSidebar ? setShowSidebar(false): setShowSidebar(true);
        }
      };
      instance.setToolbarItems([...PSPDFKit.defaultToolbarItems, sidebarButton])
    })();

    return () => PSPDFKit && PSPDFKit.unload(container)
  }, []);

  // This div element will render the document to the DOM.
  return(
    <div>
      <CustomSidebarRef ref={sidebarRef} showSidebar={showSidebar}/>
      <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  )
}
