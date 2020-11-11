export class Planned {
    title: string;
    proposals: [Proposal]
}

export class Proposal {
    fromDay: Date;
    toDay: Date;
    fromHour: string;
    toHour: string
}