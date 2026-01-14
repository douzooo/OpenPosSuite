import { useEffect, useRef, useState } from "react";

const ScrollArea = ({ children }: { children: React.ReactNode }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffsetRef = useRef(0);
    const [canScroll, setCanScroll] = useState(false);


    const thumbHeight = 180;

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        const updateCanScroll = () => {
            setCanScroll(content.scrollHeight > content.clientHeight);
        };
        updateCanScroll();

        const resizeObserver = new ResizeObserver(() => {
            updateCanScroll();
        });
        resizeObserver.observe(content);

        return () => {
            resizeObserver.disconnect();
        };
    }, [children]);

    useEffect(() => {
        onScroll();
    }, [children]);

    const onScroll = () => {
        const content = contentRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!content || !track || !thumb) return;

        const maxScroll = content.scrollHeight - content.clientHeight;
        const maxThumb = track.clientHeight - thumbHeight;
        if (maxScroll <= 0) return;

        thumb.style.transform = `translateY(${(content.scrollTop / maxScroll) * maxThumb}px)`;
    };

    const scrollToPosition = (clientY: number, useOffset = false) => {
        const content = contentRef.current;
        const track = trackRef.current;
        if (!content || !track) return;

        const trackRect = track.getBoundingClientRect();
        let clickPosition = clientY - trackRect.top;

        if (useOffset) {
            clickPosition -= dragOffsetRef.current;
        } else {
            clickPosition -= thumbHeight / 2;
        }

        const trackHeight = track.clientHeight;
        const maxScroll = content.scrollHeight - content.clientHeight;
        const maxThumb = trackHeight - thumbHeight;

        const targetPosition = (clickPosition / maxThumb) * maxScroll;
        content.scrollTop = targetPosition;
    };

    const onThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const thumb = thumbRef.current;
        if (!thumb) return;

        const thumbRect = thumb.getBoundingClientRect();
        dragOffsetRef.current = e.clientY - thumbRect.top;
        setIsDragging(true);
    };

    const onThumbTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const thumb = thumbRef.current;
        if (!thumb) return;

        const thumbRect = thumb.getBoundingClientRect();
        dragOffsetRef.current = e.touches[0].clientY - thumbRect.top;
        setIsDragging(true);
    };

    const onTrackClick = (e: React.MouseEvent) => {
        if (e.target === thumbRef.current) return;
        scrollToPosition(e.clientY);
    };

    useEffect(() => {
        if (!isDragging) return;

        const onMouseMove = (e: MouseEvent) => {
            scrollToPosition(e.clientY, true);
        };

        const onMouseUp = () => {
            setIsDragging(false);
        };

        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                scrollToPosition(e.touches[0].clientY, true);
            }
        };

        const onTouchEnd = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging]);

    return (
        <div className="h-full w-full flex flex-row flex-1 gap-2">
            {/* contennt */}
            <div
                ref={contentRef}
                onScroll={onScroll}
                className="relative flex-1 min-w-0 h-full overflow-y-scroll"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {children}

            </div>

            {/* track */}
            <div className={"px-4 flex flex-col items-center select-none user-select-none mb-5" + (canScroll ? "" : " invisible")}>
                <div className="min-w-10 min-h-10 border rounded-full border-gray-400 flex items-center justify-center select-none rotate-180" onClick={
                    () => {
                    }
                }>v</div>
                <div
                    ref={trackRef}
                    className={"w-2 h-full bg-gray-200 relative rounded-full cursor-pointer my-2 "}
                    onClick={onTrackClick}
                >
                    <div
                        ref={thumbRef}
                        className="absolute -ml-4 bg-white border border-gray-400 w-10 rounded-full cursor-grab active:cursor-grabbing text-2xl text-gray-400 flex items-center justify-center select-none"
                        style={{ height: thumbHeight }}
                        onMouseDown={onThumbMouseDown}
                        onTouchStart={onThumbTouchStart}
                    >
                        =
                    </div>
                </div>
                <div className="min-w-10 min-h-10 border rounded-full border-gray-400 flex items-center justify-center select-none">v</div>
            </div>
        </div>
    );
};

export default ScrollArea;