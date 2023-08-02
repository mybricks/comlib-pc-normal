export interface Data {
    options: { label: string, value: any, disabled?: boolean, useIcon:boolean, icon: string, iconColor: string, link: string }[],
    placement: "bottomLeft" | "bottomCenter" | "bottomRight" | "topLeft" | "topCenter" | "topCenter",
    width: number | string,
    isCustom: boolean,
    content: string,
    trigger: "hover" | "click"
}