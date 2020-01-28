import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Audiotrack from "@material-ui/icons/Audiotrack";
import ArtistList from "views/Artists/ArtistList";
import AlbumList from "views/Albums/AlbumList";
import SongList from "views/Songs/SongList";

const dashboardRoutes = [
  {
    path: "/artists",
    name: "Artists",
    rtlName: "قائمة الجدول",
    icon: Person,
    component: ArtistList,
    layout: "/admin"
  },
  {
    path: "/albums",
    name: "Albums",
    rtlName: "قائمة الجدول",
    icon: LibraryBooks,
    component: AlbumList,
    layout: "/admin"
  },
  {
    path: "/songs",
    name: "Songs",
    rtlName: "قائمة الجدول",
    icon: Audiotrack,
    component: SongList,
    layout: "/admin"
  }  
];

export default dashboardRoutes;
