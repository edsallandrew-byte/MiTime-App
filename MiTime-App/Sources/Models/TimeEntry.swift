import Foundation

struct TimeEntry: Identifiable, Codable {
    let id: UUID
    var title: String
    var startTime: Date
    var endTime: Date?

    var duration: TimeInterval {
        (endTime ?? Date()).timeIntervalSince(startTime)
    }

    init(id: UUID = UUID(), title: String, startTime: Date = .now, endTime: Date? = nil) {
        self.id = id
        self.title = title
        self.startTime = startTime
        self.endTime = endTime
    }
}
