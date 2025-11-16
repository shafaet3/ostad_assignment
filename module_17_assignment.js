// 1. 
function scheduleMeetings(meetings, rooms) {
    meetings.sort((a, b) => {
        if (a.end === b.end) return b.priority - a.priority;
        return a.end - b.end;
    });

    const roomSchedules = {};
    for (const room of rooms) {
        roomSchedules[room.id] = [];
    }

    function roomCanHost(room, meeting) {
        if (room.capacity < meeting.attendees) return false;

        for (const req of meeting.equipment) {
            if (!room.equipment.includes(req)) return false;
        }

        for (const slot of roomSchedules[room.id]) {
            if (!(meeting.end <= slot.start || meeting.start >= slot.end)) {
                return false;
            }
        }

        return true;
    }

    const schedule = [];

    for (const meeting of meetings) {
        for (const room of rooms) {
            if (roomCanHost(room, meeting)) {
                roomSchedules[room.id].push({ start: meeting.start, end: meeting.end });

                schedule.push({
                    meeting_id: meeting.id,
                    room_id: room.id,
                    time: `(${meeting.start}, ${meeting.end})`
                });

                break;
            }
        }
    }

    return schedule;
}

const meetings = [
    {"id": 1, "start": 9, "end": 10, "attendees": 8, "equipment": ["projector"], "priority": 3},
    {"id": 2, "start": 9, "end": 11, "attendees": 4, "equipment": [], "priority": 4},
    {"id": 3, "start": 10, "end": 12, "attendees": 12, "equipment": ["projector", "vc"], "priority": 5},
];

const rooms = [
    {"id": "A", "capacity": 10, "equipment": ["projector", "whiteboard"]},
    {"id": "B", "capacity": 6, "equipment": ["vc", "projector"]},
    {"id": "C", "capacity": 15, "equipment": ["projector", "vc", "whiteboard"]},
];

console.log("schedule =", scheduleMeetings(meetings, rooms));

// 2. 
function allocateEquipment(equipment_available, meetings) {
    for (const m of meetings) {
        const totalEquip = Object.values(m.equipment_required)
                                 .reduce((a, b) => a + b, 0);

        m.full_value = m.priority * m.duration;
        m.ratio = m.full_value / totalEquip;
    }

    meetings.sort((a, b) => b.ratio - a.ratio);

    const allocation_result = [];
    let total_value = 0;

    for (const meeting of meetings) {
        let satisfaction_ratios = [];

        for (const [eq, req] of Object.entries(meeting.equipment_required)) {
            const available = equipment_available[eq] || 0;

            const allocated = Math.min(req, available);

            equipment_available[eq] -= allocated;

            satisfaction_ratios.push(allocated / req);
        }

        const effective_ratio = Math.min(...satisfaction_ratios);

        const meeting_value =
            meeting.full_value * Math.min(1, effective_ratio);

        total_value += meeting_value;

        allocation_result.push({
            meeting_id: meeting.id,
            allocated_ratio: effective_ratio,
            value_gained: meeting_value.toFixed(2)
        });
    }

    return {
        total_value: total_value.toFixed(2),
        details: allocation_result
    };
}

const equipment_available = {
    projector: 3,
    vc: 2,
    whiteboard: 4
};

const flexible_meetings = [
    {id: 1, priority: 3, duration: 2, equipment_required: {projector: 1, vc: 1}},
    {id: 2, priority: 5, duration: 1, equipment_required: {projector: 1}},
];

console.log(allocateEquipment(equipment_available, flexible_meetings));

