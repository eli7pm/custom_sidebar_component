import { forwardRef } from "react";

const CustomSidebarRef = forwardRef((props, ref)=>{
  const {showSidebar} = props
  return (
   <div ref={ref} style={{display:showSidebar?"block":"none"}}>
      Hello, this HTML comes from a Component :)
    </div>
  )
})

export default CustomSidebarRef;
