declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare module '@pqina/flip';
declare interface Window {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
  ethereum: any;
  createObjectURL: any;
}
