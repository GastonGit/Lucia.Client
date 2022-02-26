import { styled } from '@mui/material/styles';
import { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { Tooltip } from '@mui/material';
import React from 'react';

export default styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: 'var(--quaternary--bg-color)',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'var(--quaternary--bg-color)',
        color: 'var(--secondary-text-color)',
        width: '100px',
        textAlign: 'center',
    },
}));
