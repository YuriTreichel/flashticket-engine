import EventController from './EventController'
import PlatformController from './PlatformController'
import ReservationController from './ReservationController'
import TicketController from './TicketController'
import AdminController from './AdminController'
import OrganizerController from './OrganizerController'
import Settings from './Settings'
const Controllers = {
    EventController: Object.assign(EventController, EventController),
PlatformController: Object.assign(PlatformController, PlatformController),
ReservationController: Object.assign(ReservationController, ReservationController),
TicketController: Object.assign(TicketController, TicketController),
AdminController: Object.assign(AdminController, AdminController),
OrganizerController: Object.assign(OrganizerController, OrganizerController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers