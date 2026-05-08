import { Box, Button, Paper, Stack, TextField, Typography, CircularProgress } from '@mui/material'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../store'
import { login } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

type FormValues = {
  username: string
  password: string
}

export default function LoginPage() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { username: '', password: '' },
  })
  const dispatch = useAppDispatch()
  const auth = useAppSelector((s) => s.auth)
  const navigate = useNavigate()

  const onSubmit = async (values: FormValues) => {
    const res = await dispatch(login(values))
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/')
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg,#eef2fb, #f7f9fc)',
        p: 2,
      }}
    >
      <Paper sx={{ width: 420, p: 4 }} elevation={8}>
        <Stack spacing={2} alignItems="center">
          <Box component="img" src="https://cdn.alibaba.ir/dotair/logo/logo.png" alt="Aerotech" sx={{ width: 140, height: 'auto' }} />
          <Typography variant="h5">Aerotech Backoffice</Typography>
          <Typography color="text.secondary" variant="body2">
            Sign in to your administrator account
          </Typography>

          <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Username or email"
                    fullWidth
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    autoComplete="username"
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Password"
                    fullWidth
                    type="password"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    autoComplete="current-password"
                  />
                )}
              />

              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit(onSubmit)}
                disabled={auth.loading}
                sx={{ py: 1.5 }}
              >
                {auth.loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
              </Button>

              {auth.error && (
                <Typography color="error" variant="body2" align="center">
                  {auth.error}
                </Typography>
              )}
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  )
}
