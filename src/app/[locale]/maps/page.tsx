'use client'

import React, { FC, useEffect, memo } from 'react'
import { useTranslations } from 'next-intl'
import { MarkerType, UserMarker } from './type'
import { useLogicMaps } from './logic'
import { useRouter } from 'next/navigation'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import Link from 'next/link'
import RoomIcon from '@mui/icons-material/Room'
import ModalSmallMarkers from '@/components/ModalSmallMarkers'
import CommentModal from '@/components/ModalComments'
import FloatLoginButton from '@/components/FloatLoginButton'
import SimpleBottomNavigation from '@/components/BottomNav'
import CircularIndeterminate from '@/components/Loader'
import ButtonComp from '@/components/Button'
import CustomizedSwitches from '@/components/MuiSwitch'
import FloatAddMarkerButton from '@/components/FloatAddMarkerButton'
import BasicModal, { PlaceReview } from '@/components/ModalPlaces'
import SimpleSlider from '@/components/Carousel/page'
import CircularColor from '@/components/CircularColor'
import ReviewsComp from '@/components/Reviews'
import ModalCrearMarcador from '@/components/ModalAddMarker'
import ModalUserMarkers from '@/components/ModalMarkersUser'
import AccountMenu from '@/components/Menu'
import FilterButton from '@/components/FilterButton'
import MarkerUserIcon from '../../../assets/location.png'
import hiddenMarker from '../../../assets/hostage.png'
import customMarkerIconShop from '../../../assets/tienda.png'
import customMarkerIconPlace from '../../../assets/destino.png'
import SearchIcon from '@mui/icons-material/Search'
import AddCommentIcon from '@mui/icons-material/AddComment'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CloseIcon from '@mui/icons-material/Close'
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    Modal,
    Typography,
} from '@mui/material'
import {
    ButtonStyleCancelarLugar,
    ButtonStyleConfirmarLugar,
    CustomizedSwitchesStyles,
    IconMarker,
    LikesLabel,
    MainContainer,
    MapContainer,
    ReviewsContainer,
    BadgeContainer,
    stylesMaps,
    ContainerModalSmall,
} from './style'

import IntroJs from 'intro.js'
import 'intro.js/introjs.css' // Estilo CSS de intro.js
import 'intro.js/themes/introjs-modern.css' // Tema moderno de intro.js
import IntroTour from '@/components/AAintroJS'

// Declara una variable llamada markerClusterer para agrupar los marcadores.
let markerClusterer: MarkerClusterer | null = null

// Declara un componente de React llamado GoogleMapComp.
const GoogleMapComp: FC = () => {
    const {
        styledMap,
        selectMapStyle,
        mapRef,
        openAddMarkerMode,
        setCurrentLocationMarker,
        addingMarker,
        isButtonDisabled,
        style,
        setStyle,
        loading,
        setLoading,
        center,
        positionMarkerUser,
        floatMarker,
        handlerConfirmation,
        direccion,
        tipoLugar,
        descripcion,
        fotos,
        userMarkers,
        confirmedMarkers,
        handleCloseModal,
        handleCloseLugar,
        place,
        modalIsOpen,
        setPlace,
        openModal,
        closeModal,
        getAllMarkersUser,
        isButtonDisabledPlaces,
        setIsButtonDisabledPlaces,
        getIcon,
        modalUserMarker,
        setModalUserMarker,
        setDataMarkerUser,
        dataMarkerUser,
        loadingLocation,
        setLoadingLocation,
        isSmallScreen,
        currentUser,
        filteredMarkers,
        setFilteredMarkers,
        openModalComments,
        handleOpenModalComments,
        handleCloseModalComments,
        likedMarkers,
        handleToogleLikeModal,
        handleShareOnFacebook,
        handleShareOnWhatsApp,
        badgeNewMarkers,
        openModalBadge,
        closeModalBadge,
        openDetailModal,
        setOpenDetailModal,
        handleMarkerClickMiniModal,
        selectedMarkers,
        setSelectedMarkers,
        markersSmallModal,
        markersSetSmallModal,
        locationUser,
        setLocationUser,
        goToMarkerUserLocation,
        openModalBadged,
        oneWeekAgoNew,
        newMarkers,
        isLogged,
        setIsLogged,
        locale,
        openSmallModal,
        setOpenSmallModal,
        token,
        userId,
        activateMiniModal,
        setActivateMiniModal,
        disableMiniModal,
        enableMiniModal,
    } = useLogicMaps()

    useEffect(() => {
        if (!token) {
            setIsLogged(false)
            // router.push('/auth/login'); // Redirige al usuario a la página de inicio de sesión si no hay token
        } else {
            setIsLogged(true)
        }
    }, [])

    // Crea una referencia mutable para almacenar el mapa de Google Maps.
    const markers: google.maps.Marker[] = []
    let map: google.maps.Map
    let service: google.maps.places.PlacesService
    const t = useTranslations('maps')
    const router = useRouter()

    const getMyPosition = async () => {
        setLoadingLocation(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords
                    const currentLatLng = { lat: latitude, lng: longitude }

                    const infoWindow = new google.maps.InfoWindow({
                        content: 'Usted está aquí',
                        ariaLabel: 'Usted está aquí',
                    })
                    // Crea un nuevo marcador para la ubicación actual
                    const marker = new google.maps.Marker({
                        position: currentLatLng,
                        map: mapRef.current,
                        animation: window.google.maps.Animation.DROP, // Agregar la animación de "drop"
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#9900ff',
                            fillOpacity: 8,
                            strokeWeight: 8,
                            scale: 8,
                        },
                    })

                    marker.addListener('click', () => {
                        infoWindow.open({
                            anchor: marker,
                            map: mapRef.current,
                        })
                    })
                    // Actualiza la variable de estado con el nuevo marcador
                    setCurrentLocationMarker(marker)
                    // Centra el mapa en la ubicación actual
                    mapRef.current?.setCenter(currentLatLng)
                    setLoadingLocation(false)
                },
                error => {
                    console.error('Error getting current location:', error)
                    setLoadingLocation(false)
                    // Manejar la situación de ubicación desactivada en la interfaz de usuario
                }
            )
        } else {
            // El navegador no admite la geolocalización
            setLoadingLocation(false)
            // Manejar la situación de geolocalización no admitida en la interfaz de usuario
        }
    }

    async function initMap() {
        if (typeof window !== 'undefined' && confirmedMarkers) {
            map = new window.google.maps.Map(
                document.getElementById('map') as HTMLElement,
                {
                    center: center,
                    zoom: 8,
                    zoomControl: false,
                    zoomControlOptions: {
                        position: 9,
                    },
                    disableDefaultUI: true,
                    streetViewControl: false,
                    styles: style,
                    draggable: true,
                    gestureHandling: 'greedy',
                }
            )
            mapRef.current = map
            service = new google.maps.places.PlacesService(map)
            // Crear una instancia de MarkerClusterer
            const clusterOptions = {
                imagePath:
                    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                gridSize: 30,
                zoomOnClick: false,
                maxZoom: 8,
                minimumClusterSize: 2,
            }
            markerClusterer = new MarkerClusterer({
                map,
                algorithmOptions: clusterOptions,
            })

            renderMarkers(userMarkers) // Renderiza los marcadores en el mapa

            const updateResultsButton = document.getElementById(
                'updateResultsButton'
            )
            if (updateResultsButton) {
                const handleClick = () => {
                    setIsButtonDisabledPlaces(true) // Deshabilita el botón
                    performSearch() // Llama a la función performSearch
                    setTimeout(() => {
                        setIsButtonDisabledPlaces(false) // Habilita el botón después de 5 segundos
                    }, 5000) // 5000 milisegundos = 5 segundos
                }

                updateResultsButton.addEventListener('click', handleClick)
            }
            map.addListener('drag', () => {
                // Obtener el valor actual del zoom
                const zoom = map.getZoom()

                // Obtener las coordenadas del centro del mapa
                if (map) {
                    center.lat = map.getCenter()?.lat() || 0
                    center.lng = map.getCenter()?.lng() || 0
                }

                if (center && userMarkers) {
                    // Crear un arreglo de objetos que contienen los marcadores y sus distancias al centro
                    const markersWithDistance = userMarkers.map(marker => {
                        const location = marker.location
                        if (location && center) {
                            // Calcular la distancia entre el centro del mapa y el marcador
                            const distance =
                                google.maps.geometry.spherical.computeDistanceBetween(
                                    center,
                                    location
                                )
                            return { marker, distance }
                        }
                        return null
                    })

                    // Filtrar los marcadores dentro del rango de distancia deseado
                    const maxDistance = 50000 // Por ejemplo, 50 km
                    const filteredMarkers = markersWithDistance.filter(
                        item => item && item.distance <= maxDistance
                    )

                    // Ordenar los marcadores en función de la distancia, los más cercanos primero
                    filteredMarkers.sort((a, b) => a!.distance - b!.distance)

                    // Obtener los marcadores ordenados en un arreglo separado
                    const orderedMarkers = filteredMarkers.map(
                        item => item!.marker
                    )

                    // Actualizar el estado de los marcadores para mostrar los filtrados y ordenados
                    markersSetSmallModal(orderedMarkers)

                    setOpenSmallModal(true)
                }
            })

            await getMyPosition()

            setLoading(false)
        }
    }

    function performSearch() {
        const center = map.getCenter()
        // Eliminar los marcadores anteriores
        if (markerClusterer) markerClusterer.clearMarkers()

        // Options to pass along to the marker clusterer
        const clusterOptions = {
            imagePath:
                'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            gridSize: 30,
            zoomOnClick: false,
            maxZoom: 8,
            minimunClusterSize: 2,
        }

        markerClusterer = new MarkerClusterer({
            map,
            markers: [], // Inicialmente sin marcadores
            algorithmOptions: clusterOptions,
        })

        const requestShops = {
            location: center,
            radius: 10000,
            query: 'Tienda de articulos pesca',
            locationBias: { radius: 10000, center: center },

            // type: ['']
        }
        const requestPlayas = {
            location: center,
            radius: 10000,
            query: 'Playas',
            locationBias: { radius: 10000, center: center },

            // type: ['']
        }

        service.textSearch(requestShops, callback)
        // service.textSearch(requestCebos, callback)
        service.textSearch(requestPlayas, callback)
    }

    function markerPlaceGoogle(place: google.maps.places.PlaceResult) {
        let iconUrl =
            'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        // Icono predeterminado
        // Verificar el tipo de lugar y asignar un icono específico
        if (place.types?.includes('store' || 'establishment')) {
            iconUrl = customMarkerIconShop.src
        } else if (
            place.types?.includes('natural_feature' || 'point_of_interest')
        ) {
            iconUrl = customMarkerIconPlace.src
        }

        const icon = {
            url: iconUrl,
            scaledSize: new google.maps.Size(26, 26),
        } as google.maps.Icon
        const marker = new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry?.location,
            icon: icon,
        })

        markerClusterer?.addMarker(marker) // Agregar el marcador al clúster

        marker.addListener('click', () => {
            if (!selectedMarkers.includes(marker)) {
                setSelectedMarkers(prevMarkers => [...prevMarkers, marker])
            }
            setPlace(place)
        })

        google.maps.event.addListener(marker, 'click', function () {
            // Acción al hacer clic en el marcador
            if (place.place_id) {
                service.getDetails(
                    { placeId: place.place_id },
                    (result, status) => {
                        if (
                            status === google.maps.places.PlacesServiceStatus.OK
                        ) {
                            openModal(result)
                            // Aquí puedes acceder a los detalles del lugar en la variable "result"
                        }
                    }
                )
            }
        })
    }

    function callback(
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus,
        pagination: google.maps.places.PlaceSearchPagination | null
    ) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (const place of results!) {
                markerPlaceGoogle(place)
            }
        }
    }

    // Renderiza los marcadores en el mapa.
    const renderMarkers = (markers: UserMarker[]) => {
        // Elimina los marcadores actuales del clusterer
        if (markerClusterer) markerClusterer.clearMarkers()

        markers.forEach((marker: any) => {
            const location = {
                lat: marker.location.lat,
                lng: marker.location.lng,
            }
            const iconUrl = getIcon(marker.markerType)
            const iconUrlHidden = hiddenMarker.src

            // Si el marcador pertenece al usuario actual y está oculto
            if (marker.userId === currentUser?.id && !marker.visible) {
                const infoWindow = new google.maps.InfoWindow({
                    content: 'Oculto',
                    ariaLabel: 'Oculto',
                })

                const markers = new google.maps.Marker({
                    position: location,
                    map: mapRef.current,
                    animation: window.google.maps.Animation.DROP,
                    icon: {
                        url: iconUrlHidden, // Usa el ícono para los marcadores ocultos
                        scaledSize: new google.maps.Size(22, 22),
                    },
                })
                markers.setMap(map)
                markerClusterer?.addMarker(markers)

                markers.addListener('click', () => {
                    setModalUserMarker(true)
                    setDataMarkerUser(marker)
                    setLocationUser(location)
                })
                infoWindow.open(mapRef.current, markers)
                // Cerrar el InfoWindow automáticamente después de 5 segundos
                setTimeout(() => {
                    infoWindow.close()
                }, 5000)
            }
            // Si el marcador es visible
            else if (marker.visible) {
                const markers = new google.maps.Marker({
                    position: location,
                    map: mapRef.current,
                    animation:
                        iconUrl.url === '/_next/static/media/algas.f94c4aec.png'
                            ? window.google.maps.Animation.BOUNCE
                            : window.google.maps.Animation.DROP,
                    icon: {
                        url: iconUrl?.url,
                        scaledSize:
                            iconUrl.url ===
                            '/_next/static/media/algas.f94c4aec.png'
                                ? new google.maps.Size(36, 36)
                                : new google.maps.Size(26, 26),
                    },
                })
                markers.setMap(map)
                markerClusterer?.addMarker(markers)

                markers.addListener('click', () => {
                    setModalUserMarker(true)
                    setDataMarkerUser(marker)
                    setLocationUser(location)
                })
            }
        })
    }

    // Función para filtrar los marcadores según el tipo de filtro.
    const filterMarkers = (filter: MarkerType) => {
        let filteredMarkerInstances: UserMarker[] = []

        if (filter === MarkerType.ALL) {
            filteredMarkerInstances = [...userMarkers]
        } else if (filter === MarkerType.LIKES) {
            filteredMarkerInstances = [
                ...(userMarkers &&
                    userMarkers.filter((marker: any) =>
                        marker.likes.some((like: any) => like.userId === userId)
                    )),
            ]
        } else {
            filteredMarkerInstances = userMarkers.filter(
                (marker: any) => marker.markerType === filter
            )
        }
        setFilteredMarkers(filteredMarkerInstances)
    }

    // Maneja el cambio de filtro.
    const handleFilterChange = (newFilter: MarkerType) => {
        filterMarkers(newFilter) // Aplica el filtro y actualiza la lista de marcadores filtrados
    }

    const goToLogin = () => {
        router.push(`/${locale}/auth/login`)
    }

    // Efecto que se ejecuta cuando se carga el API de Google Maps y se establece el centro del mapa.
    useEffect(() => {
        initMap()
        if (!confirmedMarkers) {
            getAllMarkersUser()
        }
    }, [confirmedMarkers])

    useEffect(() => {
        if (mapRef.current) {
            renderMarkers(filteredMarkers)
        }
    }, [filteredMarkers])

    // Efecto que se ejecuta cuando cambian los marcadores para actualizar el cluster de marcadores.
    useEffect(() => {
        if (markerClusterer) {
            markerClusterer.clearMarkers()
            markerClusterer.addMarkers(markers)
        }
    }, [])

    // Efecto que se ejecuta cuando cambia el estilo del mapa.
    useEffect(() => {
        const updatedStyle = styledMap ? stylesMaps : []
        setStyle(updatedStyle)
    }, [styledMap])

    useEffect(() => {
        const handleScroll = (event: Event) => {
            event.preventDefault()
        }
        // Bloquear el desplazamiento cuando se monta el componente
        document.body.style.overflow = 'hidden'
        document.addEventListener('scroll', handleScroll, { passive: false })

        return () => {
            // Permitir el desplazamiento cuando se desmonta el componente
            document.body.style.overflow = ''
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        // Agrega la regla de estilo para el InfoWindow
        const styleElement = document.createElement('style')
        styleElement.textContent =
            '.gm-style iframe + div { border:none!important; }'
        document.head.appendChild(styleElement)

        // ... tu lógica para inicializar el mapa aquí ...
    }, [])

    // cambia la posición del switch dependiendo del tamaño de la pantalla
    let bottomPosition
    if (typeof window !== 'undefined') {
        if (window.innerWidth < 600) {
            bottomPosition = '150px'
        } else {
            bottomPosition = '160px'
        }
    }

    // Renderiza el componente.
    if (loading && userMarkers.length === 0) {
        return (
            <>
                <CircularIndeterminate />
                <SimpleBottomNavigation />
            </>
        )
    }
    return (
        <MainContainer>
            <>
                <AccountMenu
                    className="menu"
                    userPicture={currentUser?.picture as string}
                />
                <FilterButton onChange={handleFilterChange} />
                <BadgeContainer>
                    <IconButton onClick={openModalBadge} sx={{ padding: 0 }}>
                        <Badge
                            badgeContent={badgeNewMarkers.length}
                            color="secondary"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <NotificationsIcon sx={{ color: '#fff' }} />
                        </Badge>
                    </IconButton>
                </BadgeContainer>
                <Modal open={openModalBadged} onClose={closeModalBadge}>
                    <>
                        <Box
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%',
                                height: 'auto',
                                maxHeight: '90%',
                                backgroundColor: '#fff',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'scroll',
                            }}
                        >
                            <Typography
                                component={'div'}
                                sx={{
                                    textAlign: 'center',
                                    mt: 3,
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    marginBottom: 2,
                                }}
                            >
                                {t('monthlyMarkers')}
                                <CloseIcon
                                    onClick={closeModalBadge}
                                    sx={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Typography>
                            {newMarkers.map((marker: any) => (
                                <React.Fragment key={marker.id}>
                                    <ListItem
                                        key={marker.id}
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            cursor: 'pointer',
                                        }}
                                        alignItems="flex-start"
                                        onClick={() => {
                                            setModalUserMarker(true)
                                            setDataMarkerUser(marker)
                                            setLocationUser(marker.location)
                                        }}
                                    >
                                        <div>
                                            <img
                                                key={marker.id}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '30px',
                                                    marginRight: '1.5rem',
                                                    objectFit: 'cover',
                                                }}
                                                src={marker.picture as string}
                                            />
                                        </div>

                                        <ListItemText
                                            primaryTypographyProps={{
                                                width: '220px',
                                            }}
                                            primary={
                                                marker.direction
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                marker.direction.slice(1)
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            fontWeight: 400,
                                                            wordWrap:
                                                                'break-word',
                                                        }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {marker.description
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            marker.description.slice(
                                                                1
                                                            )}
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            width: '100%',
                                                            fontWeight: 200,
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        {marker.markerType
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            marker.markerType.slice(
                                                                1
                                                            )}
                                                    </Typography>
                                                    {new Date(
                                                        marker.createdAt
                                                    ) >= oneWeekAgoNew ? (
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="secondary"
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection:
                                                                    'column',
                                                                }}
                                                            >
                                                                {t('new')}
                                                            </Typography>
                                                        ) : null}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider
                                        sx={{
                                            width: '70%',
                                            display: 'flex',
                                            margin: '0 auto',
                                        }}
                                    />
                                </React.Fragment>
                            ))}
                        </Box>
                    </>
                </Modal>
                <MapContainer id="map" />
                {activateMiniModal ? (
                    <>
                        <Button
                            onClick={() => disableMiniModal()}
                            sx={{
                                position: 'fixed',
                                bottom: '250px',
                                left: '15px',
                                borderColor: 'white',
                                color: 'white',
                                display: markersSmallModal.length
                                    ? 'flex'
                                    : 'none',
                            }}
                            variant="outlined"
                        >
                            Cerrar
                        </Button>

                        {/* <span
                            style={{
                                position: 'fixed',
                                display: 'flex',
                            }}
                        >
                            <span
                                style={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    alignItems: 'center', // Centra verticalmente
                                    justifyContent: 'center', // Centra horizontalmente
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    display: markersSmallModal.length ? 'flex' : 'none',
                                }}
                            >

                            </span>
                        </span> */}

                        {markersSmallModal && markersSmallModal.length > 0 && (
                            <ContainerModalSmall>
                                {markersSmallModal.map(marker => (
                                    <div
                                        key={marker.id}
                                        onClick={() =>
                                            handleMarkerClickMiniModal(
                                                marker,
                                                marker.location
                                            )
                                        }
                                    >
                                        <ModalSmallMarkers
                                            onClick={() =>
                                                handleMarkerClickMiniModal(
                                                    marker,
                                                    marker.location
                                                )
                                            }
                                            key={marker.id}
                                            isOpen={openSmallModal}
                                            onClose={() =>
                                                setOpenSmallModal(false)
                                            }
                                            picture={marker.picture as string}
                                            place={marker.direction}
                                            markerType={marker.markerType}
                                        />
                                    </div>
                                ))}
                            </ContainerModalSmall>
                        )}
                    </>
                ) : (
                    <Button
                        onClick={() => enableMiniModal()}
                        sx={{
                            position: 'fixed',
                            bottom: '80px',
                            left: '15px',
                            borderColor: 'white',
                            color: 'white',
                        }}
                        disabled={markersSmallModal.length ? false : true}
                        variant="outlined"
                    >
                        Abrir Leyenda
                    </Button>
                )}

                {openDetailModal && (
                    <>
                        <ModalUserMarkers
                            isOpen={openDetailModal}
                            onClose={() => setOpenDetailModal(false)}
                            pictures={dataMarkerUser?.picture as string}
                            creator={dataMarkerUser?.user?.name}
                            icon={
                                <Avatar
                                    src={dataMarkerUser!.user?.picture}
                                    sx={{
                                        width: 25,
                                        height: 25,
                                        marginTop: '0rem',
                                    }}
                                />
                            }
                            link={
                                <Link
                                    style={{
                                        textDecorationColor: '#49007a',
                                        color: '#49007a',
                                    }}
                                    href={`/${locale}/feed/${dataMarkerUser?.user?.id}`}
                                >
                                    {dataMarkerUser?.user?.name}
                                </Link>
                            }
                            direction={
                                dataMarkerUser!.direction
                                    .charAt(0)
                                    .toUpperCase() +
                                dataMarkerUser!.direction.slice(1)
                            }
                            markerType={
                                dataMarkerUser!.markerType
                                    .charAt(0)
                                    .toUpperCase() +
                                dataMarkerUser!.markerType.slice(1)
                            }
                            description={
                                dataMarkerUser!.description
                                    .charAt(0)
                                    .toUpperCase() +
                                dataMarkerUser!.description.slice(1)
                            }
                            onClick={() => {
                                if (
                                    locationUser &&
                                    locationUser?.lat !== undefined &&
                                    locationUser?.lng !== undefined
                                ) {
                                    const location: google.maps.LatLngLiteral =
                                        {
                                            lat: locationUser?.lat,
                                            lng: locationUser?.lng,
                                        }
                                    goToMarkerUserLocation(location)
                                } else {
                                    // Aquí puedes manejar el caso donde `dataMarkerUser` no tiene valores válidos
                                    console.error(
                                        'No se encontró una ubicación válida en el marcador seleccionado.'
                                    )
                                }
                            }}
                            isLiked={likedMarkers[dataMarkerUser?.id as string]} // Accede al valor correspondiente al marcador actual
                            onClickLike={handleToogleLikeModal}
                            likes={dataMarkerUser?.likes?.length}
                            handleShareOnWhatsApp={() =>
                                handleShareOnWhatsApp(
                                    dataMarkerUser?.userId as string
                                )
                            }
                            handleShareOnFacebook={() =>
                                handleShareOnFacebook(
                                    dataMarkerUser?.userId as string
                                )
                            }
                            icon2={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <IconButton
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 0,
                                        }}
                                        onClick={handleOpenModalComments}
                                    >
                                        <AddCommentIcon
                                            sx={{
                                                color: '#49007a',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </IconButton>
                                    <LikesLabel>
                                        {dataMarkerUser?.comments?.length}{' '}
                                        Comentarios
                                    </LikesLabel>
                                </div>
                            }
                        />
                        <CommentModal
                            open={openModalComments}
                            id={dataMarkerUser?.id as string}
                            onClose={handleCloseModalComments}
                        />
                    </>
                )}
                <ModalCrearMarcador
                    onClose={handleCloseModal} // Cierra el modal
                    isOpen={addingMarker}
                    positionMarkerUser={positionMarkerUser}
                    direction={direccion}
                    markerType={tipoLugar}
                    description={descripcion}
                    pictures={fotos}
                />
                <>
                    <ModalUserMarkers
                        isOpen={modalUserMarker}
                        creator={dataMarkerUser?.user?.name}
                        icon={
                            <Avatar
                                src={dataMarkerUser.user?.picture}
                                sx={{
                                    width: 25,
                                    height: 25,
                                    marginTop: '0rem',
                                }}
                            />
                        }
                        link={
                            <Link
                                style={{
                                    textDecorationColor: '#49007a',
                                    color: '#49007a',
                                }}
                                href={`/${locale}/feed/${dataMarkerUser?.user?.id}`}
                            >
                                {dataMarkerUser?.user?.name}
                            </Link>
                        }
                        direction={
                            dataMarkerUser.direction.charAt(0).toUpperCase() +
                            dataMarkerUser.direction.slice(1)
                        }
                        markerType={
                            dataMarkerUser.markerType.charAt(0).toUpperCase() +
                            dataMarkerUser.markerType.slice(1)
                        }
                        description={
                            dataMarkerUser.description.charAt(0).toUpperCase() +
                            dataMarkerUser.description.slice(1)
                        }
                        pictures={dataMarkerUser.picture as string}
                        onClose={() => setModalUserMarker(false)}
                        onClick={() => {
                            if (
                                locationUser &&
                                locationUser?.lat !== undefined &&
                                locationUser?.lng !== undefined
                            ) {
                                const location: google.maps.LatLngLiteral = {
                                    lat: locationUser?.lat,
                                    lng: locationUser?.lng,
                                }
                                goToMarkerUserLocation(location)
                            } else {
                                // Aquí puedes manejar el caso donde `selectedMarker` no tiene valores válidos
                                console.error(
                                    'No se encontró una ubicación válida en el marcador seleccionado.'
                                )
                            }
                        }}
                        isLiked={likedMarkers[dataMarkerUser.id as string]} // Accede al valor correspondiente al marcador actual
                        onClickLike={handleToogleLikeModal}
                        likes={dataMarkerUser?.likes?.length}
                        handleShareOnWhatsApp={() =>
                            handleShareOnWhatsApp(
                                dataMarkerUser.userId as string
                            )
                        }
                        handleShareOnFacebook={() =>
                            handleShareOnFacebook(
                                dataMarkerUser.userId as string
                            )
                        }
                        icon2={
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <IconButton
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: 0,
                                    }}
                                    onClick={handleOpenModalComments}
                                >
                                    <AddCommentIcon
                                        sx={{
                                            color: '#49007a',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </IconButton>
                                <LikesLabel>
                                    {dataMarkerUser.comments?.length}{' '}
                                    Comentarios
                                </LikesLabel>
                            </div>
                        }
                    />
                    <CommentModal
                        open={openModalComments}
                        id={dataMarkerUser.id as string}
                        onClose={handleCloseModalComments}
                    />
                </>
                {modalIsOpen && (
                    <BasicModal
                        key={place?.place_id}
                        onClose={closeModal}
                        label={place?.name?.toLocaleUpperCase()}
                        direction={place?.formatted_address}
                        value={place?.rating}
                        phone={place?.international_phone_number}
                        numberRating={place?.user_ratings_total}
                        type={place?.types}
                        isOpenStore={
                            place?.types!.includes('natural_feature')
                                ? undefined
                                : place?.opening_hours?.isOpen()
                        }
                    >
                        {
                            <SimpleSlider
                                key={place?.place_id}
                                pictures={place?.photos?.map((photo: any) => {
                                    return {
                                        src: photo.getUrl(),
                                    }
                                })}
                            />
                        }
                        <ReviewsContainer>Reviews</ReviewsContainer>

                        {place?.reviews?.map(
                            (review: PlaceReview, index: number) => (
                                <>
                                    <ReviewsComp
                                        key={review.place_id} // Aquí usa un identificador único, como 'id', si está disponible
                                        author_name={review.author_name}
                                        author_url={review.author_url}
                                        language={review.language}
                                        profile_photo_url={
                                            review.profile_photo_url
                                        }
                                        rating={review.rating}
                                        relative_time_description={
                                            review.relative_time_description
                                        }
                                        text={review.text}
                                    />
                                </>
                            )
                        )}
                    </BasicModal>
                )}
                {loadingLocation && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente oscuro
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularColor />
                    </div>
                )}
                <SimpleBottomNavigation />
                <CustomizedSwitches
                    style={{
                        bottom: bottomPosition,
                        position: 'fixed',
                        ...CustomizedSwitchesStyles,
                    }}
                    onClick={() => selectMapStyle()}
                />
            </>
            {floatMarker && (
                <>
                    <IconMarker
                        key="iconMarker"
                        src={MarkerUserIcon.src}
                        style={{
                            position: 'fixed',
                            top: '48%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '32px',
                            height: '32px',
                            /* ... estilos adicionales ... */
                        }}
                    />
                    <span
                        key="iconPoint"
                        style={{
                            position: 'relative',
                            display: 'inline-block',
                        }}
                    >
                        {/* Punto debajo del icono */}
                        <span
                            key="point"
                            style={{
                                position: 'fixed',
                                top: '52%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: 'red',
                            }}
                        ></span>
                    </span>
                    <ButtonComp
                        key="confirmButton"
                        title={t('addMarker')}
                        style={{
                            position: 'fixed',
                            ...ButtonStyleConfirmarLugar,
                        }}
                        variant="contained"
                        onClick={handlerConfirmation}
                        icon={<RoomIcon sx={{ mr: 1, color: '#49007a' }} />}
                    />
                    <ButtonComp
                        key="cancelarButton"
                        title={t('cancelMarker')}
                        style={{
                            position: 'fixed',
                            ...ButtonStyleCancelarLugar,
                        }}
                        variant="outlined"
                        onClick={handleCloseLugar}
                    />
                </>
            )}
            <FloatAddMarkerButton
                disabled={isButtonDisabled || !isLogged}
                onClick={openAddMarkerMode}
            />
            <ButtonComp
                title={
                    isSmallScreen ? t('buttonPlacesShort') : t('buttonPlaces')
                } // Cambia el título si la pantalla es pequeña
                id="updateResultsButton"
                style={{
                    display: isButtonDisabled ? 'none' : 'flex',
                    opacity: isButtonDisabledPlaces || !isLogged ? 0 : 1,
                    position: 'fixed',
                    width: isSmallScreen ? '100px' : '235px', // Cambia el título si la pantalla es pequeña
                    top: '40px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    height: '2rem',
                }}
                icon={<SearchIcon style={{ color: 'black', marginRight: 1 }} />}
                variant="contained"
                disabled={isButtonDisabledPlaces || !isLogged}
            />
            <FloatLoginButton
                disabled={isLogged}
                title={t('login')}
                onClick={() => {
                    goToLogin()
                }}
                style={{
                    position: 'absolute',
                    top: '42px', // Centra verticalmente
                    left: '50%', // Centra horizontalmente
                    transform: 'translate(-50%, -50%)', // Centra el contenido
                    display: isLogged ? 'none' : 'flex',
                }}
            />
        </MainContainer>
    )
}

export default memo(GoogleMapComp)
