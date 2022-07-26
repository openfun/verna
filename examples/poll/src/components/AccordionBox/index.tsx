import { Box, BoxExtendedProps } from 'grommet';
import { useCallback, useRef, useEffect } from 'react';

type AccordionBoxProps = BoxExtendedProps & {
  open: boolean;
};

const AccordionBox = ({ children, className = '', open, ...props }: AccordionBoxProps) => {
  const accordionRef = useRef<HTMLDivElement>(null);

  const setBoxHeight = useCallback(() => {
    const $div = accordionRef.current!.firstElementChild;
    if ($div) {
      const height = $div.getBoundingClientRect().height;
      accordionRef.current?.style.setProperty('--height', `${height}px`);
    }
  }, [accordionRef]);

  useEffect(() => {
    setBoxHeight();
    const observer = new MutationObserver(setBoxHeight);

    observer.observe(accordionRef.current!, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={accordionRef}
      className={[className, 'accordion', open ? 'accordion--active' : ''].join(' ')}
      {...props}
    >
      <div>{children}</div>
    </Box>
  );
};

export default AccordionBox;
