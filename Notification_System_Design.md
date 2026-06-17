# Stage 1: Notification System Design

## Priority Inbox Algorithm Architecture

The Notification System needs to determine a "Priority Inbox" containing the top 'n' most important unread notifications from a continuous stream. 

### Priority Weighting Logic
Notifications are evaluated based on their `Type` and `Timestamp`.
The weighting schema is defined as:
1. **Placement**: Highest Priority (Weight 3)
2. **Result**: Medium Priority (Weight 2)
3. **Event**: Lowest Priority (Weight 1)

When comparing two notifications, the logic is:
- First, compare the priority weight of their `Type`.
- If the weights are equal, the `Timestamp` acts as the tie-breaker (more recent = higher priority).

### Efficient Top 'n' Selection
A naive approach would sort the entire array of notifications every time and slice the top 'n'. However, as notifications stream in, sorting the entire array repeatedly `O(N log N)` becomes inefficient.

Instead, we use a **Min-Heap (Priority Queue)** or a bounded insertion approach.
- Since Javascript/TypeScript lacks a built-in Min-Heap data structure, and considering `n` is relatively small (e.g., 10, 15, 20), an efficient **Bounded Insertion Sort** approach provides `O(N * n)` performance.
- As we iterate through the `N` unread notifications, we insert them into an array that maintains at most `n` elements in sorted order.
- This bounded array acts as our Priority Inbox. If a new notification has a lower priority than the lowest item in our `n`-sized array, it is discarded. If it has a higher priority, it is inserted into its correct sorted position, and the lowest priority item is evicted.

### Advantages of this Approach:
- **Performance**: Maintaining a small sorted list of size `n` is extremely fast. For `N` incoming notifications, the complexity is `O(N * n)` rather than `O(N log N)`. Since `n` is small (<= 20 typically), this behaves like `O(N)`.
- **Memory Efficiency**: We only store the top `n` items in memory for the priority inbox instead of cloning and sorting the whole array.
- **Scalability**: As the stream of notifications grows continuously, this approach ensures the UI remains responsive and unblocked.
