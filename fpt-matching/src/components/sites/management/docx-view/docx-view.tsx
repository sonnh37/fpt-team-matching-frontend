import React, {useEffect, useRef} from 'react';


const DocxView = ({url}:{url:string}) => {
    const containerRef = useRef(null);
    useEffect(() => {
        const container = containerRef.current;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const { NutrientViewer } = window;
        if (container && NutrientViewer) {
            NutrientViewer.load({
                container,
                document: url,
            });
        }

        return () => {
            NutrientViewer?.unload(container);
        };
    }, [url]);
    return <div ref={containerRef} style={{ height: "85vh", width: "75%" }} />;
};

export default DocxView;