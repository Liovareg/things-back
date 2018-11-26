import { BaseEntity } from "typeorm";

interface ControllerActionsArgument {
    entity: BaseEntity
    all?: boolean
    save?: boolean
    getById?: boolean
    update?: boolean
    delete: boolean
}

export function ControllerActions(arg: ControllerActionsArgument) {
    return null
}