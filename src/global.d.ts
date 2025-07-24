declare namespace JSX {
    interface IntrinsicElements {
        'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
            src: string;
            style?: React.CSSProperties;
            speed?: string;
            autoplay?: boolean;
            loop?: boolean;
        }, HTMLElement>;
    }
}
