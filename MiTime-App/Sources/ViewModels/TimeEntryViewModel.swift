import Foundation
import Combine

@MainActor
final class TimeEntryViewModel: ObservableObject {
    @Published var entries: [TimeEntry] = []
    @Published var activeEntry: TimeEntry?

    func start(title: String) {
        let entry = TimeEntry(title: title)
        activeEntry = entry
        entries.append(entry)
    }

    func stop() {
        guard let active = activeEntry,
              let index = entries.firstIndex(where: { $0.id == active.id }) else { return }
        entries[index].endTime = .now
        activeEntry = nil
    }
}
