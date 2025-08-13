# 🧩 Entity-Relationship Diagram

![ER Diagram](er-diagram.png)

## Entities
| Entity | Description |
|-------|-------------|
| Park | The main facility or building |
| Court | Play area within a park |
| Equipment | Fixed or movable items used in sessions |
| Maintenance | Record of maintenance tasks |
| Caretaker | Staff responsible for maintenance |
| Staff | All employees (instructors, caretakers, admins) |
| Session | Scheduled event (supervised or unsupervised) |
| Instructor | Certified trainer for sessions |
| Player | Citizen using services |
| Booking | Reservation for court/equipment |
| Sport | Type of sport offered |

## Specializations
- **Maintenance** → Equipment Maintenance, Court Maintenance
- **Session** → Supervised, Unsupervised
- **Supervised Session** → Personal Training, Group Session
- **Booking** → Common Booking, Block Booking
- **Equipment** → Fixed, Moveable