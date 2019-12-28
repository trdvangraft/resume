import React, { memo } from 'react'
import { AppBar, Toolbar, Typography, Paper, Grid } from '@material-ui/core'

const Layout = memo(props => (
    <Paper
        elevation={0}
        style={{ padding: 0, margin: 0, backgroundColor: '#fafafa' }}
    >
        <AppBar color="primary" position="static" style={{ height: 64 }}>
            <Toolbar style={{ height: 64 }}>
                <Typography color="inherit">My Todo App</Typography>
            </Toolbar>
        </AppBar>
        <Grid container spacing={2} justify={"center"}>
            <Grid item xs={12} md={8}>
                {props.children}
            </Grid>
        </Grid>
    </Paper>
));

export default Layout