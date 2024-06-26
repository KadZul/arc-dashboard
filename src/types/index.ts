import { LayoutItem } from "grid-layout-plus";
import { Component } from "vue";

export type BaseWidgetType = {
    title?: string,
    isEditing?: boolean,
    isAdding?: boolean,
    idx?: string | number,
}

export type WidgetsGridType = Array<WidgetsItemType>
export type WidgetsItemType = LayoutItem & { options: WidgetOptions } & { props?: WidgetProps }

type WidgetProps = {
    title: string,
    [key: string]: unknown
}
type WidgetOptions = {
    component: Component,
    isAdd?: boolean | undefined
}
