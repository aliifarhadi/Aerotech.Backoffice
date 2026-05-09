import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Stack,
} from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchFlightSchedules } from '../features/flightSchedules/flightSchedulesSlice'

const getString = (value: any) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return ''
}

const parseDateTime = (value: any) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { date: getString(value), time: '' }

  const optionsDate: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' }
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
  return {
    date: date.toLocaleDateString('en-US', optionsDate),
    time: date.toLocaleTimeString('en-US', optionsTime),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
  }
}

const formatDuration = (value: any) => {
  if (typeof value === 'number') {
    const hours = Math.floor(value / 60)
    const minutes = value % 60
    return `${hours}h ${minutes}m`
  }
  if (typeof value === 'string') return value
  return ''
}

const getStatusChipProps = (status: string) => {
  const key = getString(status).toLowerCase()
  switch (true) {
    case key.includes('active'):
      return { label: 'Active', color: 'success' as const }
    case key.includes('delayed'):
      return { label: 'Delayed', color: 'warning' as const }
    case key.includes('cancel') || key.includes('cancelled'):
      return { label: 'Cancelled', color: 'error' as const }
    case key.includes('closed'):
      return { label: 'Closed', color: 'default' as const }
    default:
      return { label: status || 'Unknown', color: 'default' as const }
  }
}

const normalizeFlight = (row: any, index: number) => {
  const flightNumber = getString(row.flightNumber || row.flight_number || row.flightNo || row.number)
  const routeType = getString(row.routeType || row.flightType || row.type || row.routeTypeName)
  const originIata = getString(row.origin?.iata || row.originAirport || row.departure || row.departureAirport)
  const originCity = getString(row.origin?.city || row.originCity || row.departureCity || row.departureLocation)
  const destinationIata = getString(row.destination?.iata || row.destinationAirport || row.arrival || row.arrivalAirport)
  const destinationCity = getString(row.destination?.city || row.destinationCity || row.arrivalCity || row.arrivalLocation)
  const routeInfo = getString(row.routeNotes || row.routeInfo || row.routeSummary || row.routeMeta)
  const departure = parseDateTime(row.departureTime || row.departure_date || row.departureDate || row.departureDateTime)
  const arrival = parseDateTime(row.arrivalTime || row.arrival_date || row.arrivalDate || row.arrivalDateTime)
  const duration = formatDuration(row.duration || row.flightDuration || row.blockTime)
  const operatingAirline = getString(row.airlineName || row.operatingAirline?.name || row.airline || row.carrier)
  const airlineCode = getString(row.airlineCode || row.operatingAirline?.code || row.marketingAirline)
  const loadFactorValue = Number(row.loadFactor || row.load_factor || row.loadPercentage || row.load || row.passengerLoadFactor)
  const loadFactor = Number.isFinite(loadFactorValue) ? `${loadFactorValue}%` : getString(row.loadFactor || row.load_factor || row.loadPercentage)
  const totalSeats = getString(row.seatsTotal || row.capacity || row.totalSeats || row.aircraftCapacity)
  const aircraft = getString(row.aircraft || row.aircraftType || row.plane || row.tailNumber)
  const stopBook = getString(row.stopBook || row.stopBookCutoff || row.cutoff || row.bookingCutoff)
  const version = getString(row.version || row.ver || row.scheduleVersion || row.flightVersion)
  const versionReason = getString(row.versionReason || row.updateReason || row.verReason || row.reason)
  const status = getString(row.status || row.flightStatus || row.state)
  const badge = getStatusChipProps(status)
  const routeTag = typeof row.stops === 'number' ? (row.stops === 0 ? 'Direct' : `${row.stops} Stop${row.stops === 1 ? '' : 's'}`) : getString(row.routeTag)

  return {
    id: row.id || flightNumber || `row-${index}`,
    flightNumber,
    routeType: routeType || (routeTag === 'Direct' ? 'International' : ''),
    originIata,
    originCity,
    destinationIata,
    destinationCity,
    routeInfo: routeInfo || `${originCity || originIata} ? ${destinationCity || destinationIata}`,
    routeTag,
    departure,
    arrival,
    duration,
    operatingAirline,
    airlineCode,
    loadFactor,
    loadValue: Number.isFinite(loadFactorValue) ? Math.max(0, Math.min(100, loadFactorValue)) : 0,
    totalSeats,
    aircraft,
    stopBook,
    version,
    versionReason,
    status,
    badge,
  }
}

export default function FlightSchedules() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.flightSchedules)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    dispatch(fetchFlightSchedules({ page: 1, pageSize: 10 }))
  }, [dispatch])

  const rows = useMemo(() => {
    const rawRows = Array.isArray(data?.data) ? data.data : []
    return rawRows.map((row, index) => normalizeFlight(row, index))
  }, [data])

  const allSelected = rows.length > 0 && selected.length === rows.length

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading flight schedules...</Typography>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No data loaded yet</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Flight Schedule List
      </Typography>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {rows.length > 0 ? `1–${rows.length}` : '0'} of {data.total || rows.length} flights
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" size="small">Export</Button>
          <Button variant="contained" size="small">New Flight</Button>
        </Stack>
      </Paper>

      <Paper sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: 1200 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 48 }}>
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    onChange={() => setSelected(allSelected ? [] : rows.map((row) => row.id))}
                  />
                </TableCell>
                <TableCell>Flight</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Departure</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Airline</TableCell>
                <TableCell>Load Factor</TableCell>
                <TableCell>Aircraft</TableCell>
                <TableCell>Stop Book</TableCell>
                <TableCell>Ver.</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                  <TableCell>
                    <Checkbox
                      size="small"
                      checked={selected.includes(row.id)}
                      onChange={() =>
                        setSelected((current) =>
                          current.includes(row.id) ? current.filter((item) => item !== row.id) : [...current, row.id]
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src="https://cdn.alibaba.ir/dotair/logo/logo.png" sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="subtitle2">{row.flightNumber || 'N/A'}</Typography>
                        <Chip label={row.routeType || 'Route'} size="small" sx={{ mt: 0.5 }} />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Box component="span" sx={{ bgcolor: 'text.primary', color: 'common.white', borderRadius: 1, px: 0.7, py: 0.4, fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Roboto, monospace' }}>
                          {row.originIata || 'N/A'}
                        </Box>
                        <ArrowRightAltIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Box component="span" sx={{ bgcolor: 'text.primary', color: 'common.white', borderRadius: 1, px: 0.7, py: 0.4, fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Roboto, monospace' }}>
                          {row.destinationIata || 'N/A'}
                        </Box>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {row.routeInfo || 'N/A'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">{row.departure.time || 'N/A'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.departure.date || 'N/A'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">{row.duration || 'N/A'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.arrival.time ? `Arr. ${row.arrival.time}` : 'N/A'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>{row.airlineCode?.slice(0, 2) || 'A'}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">{row.operatingAirline || 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary">Operating</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" color={row.loadValue >= 90 ? 'success.main' : row.loadValue >= 70 ? 'warning.main' : 'text.primary'}>
                        {row.loadFactor || 'N/A'}
                      </Typography>
                      <LinearProgress variant="determinate" value={row.loadValue || 0} sx={{ height: 6, borderRadius: 3 }} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.aircraft || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.totalSeats ? `${row.totalSeats} seats` : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={row.stopBook || 'N/A'} size="small" color={row.stopBook ? 'primary' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.3}>
                      <Chip label={row.version || 'v0'} size="small" />
                      {row.versionReason ? <Typography variant="caption" color="text.secondary">{row.versionReason}</Typography> : null}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip {...row.badge} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">Actions</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
