import {
    Box,
    Button,
    IconButton,
    styled,
    TextField,
    Tooltip,
} from '@mui/material';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { useFeedback } from './useFeedback';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useUserFeedbackApi } from 'hooks/api/actions/useUserFeedbackApi/useUserFeedbackApi';
import useToast from 'hooks/useToast';
import { ProvideFeedbackSchema } from '../../openapi';

export const ParentContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '100vw',
    height: '100vh',
    '&::after': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(32, 32, 33, 0.40)',
        zIndex: theme.zIndex.fab,
    },
}));
export const StyledContainer = styled('div')(({ theme }) => ({
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    opacity: 1,
    borderRadius: theme.spacing(2.5, 0, 0, 2.5),
    background: `linear-gradient(307deg, #3D3980 0%, #615BC2 26.77%, #6A63E0 48.44%, #6A63E0 72.48%, #8154BF 99.99%)`,
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.sticky,
}));

export const StyledContent = styled('div')(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(6),
    flexDirection: 'column',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(8.5),
    alignSelf: 'stretch',
}));

export const StyledTitle = styled(Box)(({ theme }) => ({
    color: '#fff',
    fontSize: theme.spacing(3),
    fontWeight: 400,
    lineHeight: theme.spacing(2.5),
}));

export const StyledForm = styled('form')(({ theme }) => ({
    display: 'flex',
    width: '400px',
    padding: theme.spacing(3),
    flexDirection: 'column',
    gap: theme.spacing(3),
    alignItems: 'flex-start',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1.5),
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.12)',

    '& > *': {
        width: '100%',
    },
}));

export const FormTitle = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: theme.spacing(2),
    lineHeight: theme.spacing(2.75),
    fontWeight: theme.typography.fontWeightBold,
}));

export const FormSubTitle = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontSize: theme.spacing(1.75),
    lineHeight: theme.spacing(2.5),
}));

export const StyledButton = styled(Button)(() => ({
    width: '100%',
}));

const StyledScoreContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start',
}));

const StyledScoreInput = styled('div')(() => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
}));

const StyledScoreHelp = styled('span')(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: theme.spacing(1.75),
}));

const ScoreHelpContainer = styled('span')(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
}));

const StyledScoreValue = styled('label')(({ theme }) => ({
    '& input': {
        clip: 'rect(0 0 0 0)',
        position: 'absolute',
    },
    '& span': {
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.palette.background.elevation2,
        width: theme.spacing(4),
        height: theme.spacing(4),
        borderRadius: theme.spacing(12.5),
        userSelect: 'none',
        cursor: 'pointer',
    },
    '& input:checked + span': {
        fontWeight: theme.typography.fontWeightBold,
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    '& input:hover + span': {
        outline: '2px solid',
        outlineOffset: 2,
        outlineColor: theme.palette.primary.main,
    },
}));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: theme.palette.background.paper,
}));

export const FeedbackComponent = () => {
    const { feedbackData, showFeedback, closeFeedback } = useFeedback();

    if (!feedbackData) return null;

    const { setToastData } = useToast();
    const { addFeedback } = useUserFeedbackApi();

    function isProvideFeedbackSchema(data: any): data is ProvideFeedbackSchema {
        data.difficultyScore = data.difficultyScore
            ? Number(data.difficultyScore)
            : undefined;

        return (
            typeof data.category === 'string' &&
            typeof data.userType === 'string' &&
            (typeof data.difficultyScore === 'number' ||
                data.difficultyScore === undefined)
        );
    }

    const onSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        if (isProvideFeedbackSchema(data)) {
            await addFeedback(data as ProvideFeedbackSchema);
            setToastData({
                title: 'Feedback sent',
                type: 'success',
            });
        } else {
            setToastData({
                title: 'Feedback not sent',
                type: 'error',
            });
        }
        closeFeedback();
    };

    const [selectedScore, setSelectedScore] = useState<string | null>(null);

    const onScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedScore(event.target.value);
    };

    return (
        <ConditionallyRender
            condition={showFeedback}
            show={
                <ParentContainer>
                    <StyledContainer>
                        <Tooltip title='Close' arrow>
                            <StyledCloseButton
                                onClick={closeFeedback}
                                size='large'
                            >
                                <CloseIcon />
                            </StyledCloseButton>
                        </Tooltip>
                        <StyledContent>
                            <StyledTitle>
                                Help us to improve Unleash
                            </StyledTitle>
                            <StyledForm onSubmit={onSubmission}>
                                <input
                                    type='hidden'
                                    name='category'
                                    value={feedbackData.category}
                                />
                                <input
                                    type='hidden'
                                    name='userType'
                                    value={feedbackData.userType}
                                />
                                <FormTitle>{feedbackData.title}</FormTitle>
                                <StyledScoreContainer>
                                    <StyledScoreInput>
                                        {[1, 2, 3, 4, 5, 6, 7].map((score) => (
                                            <StyledScoreValue key={score}>
                                                <input
                                                    type='radio'
                                                    name='difficultyScore'
                                                    value={score}
                                                    onChange={onScoreChange}
                                                />
                                                <span>{score}</span>
                                            </StyledScoreValue>
                                        ))}
                                    </StyledScoreInput>
                                    <ScoreHelpContainer>
                                        <StyledScoreHelp>
                                            Very difficult
                                        </StyledScoreHelp>
                                        <StyledScoreHelp>
                                            Very easy
                                        </StyledScoreHelp>
                                    </ScoreHelpContainer>
                                </StyledScoreContainer>
                                <Box>
                                    <FormSubTitle>
                                        {feedbackData.positiveLabel}
                                    </FormSubTitle>
                                    <TextField
                                        label='Your answer here'
                                        style={{ width: '100%' }}
                                        name='positive'
                                        multiline
                                        rows={3}
                                        variant='outlined'
                                        size='small'
                                        InputLabelProps={{
                                            style: {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <FormSubTitle>
                                        {feedbackData.areasForImprovementsLabel}
                                    </FormSubTitle>
                                    <TextField
                                        label='Your answer here'
                                        style={{ width: '100%' }}
                                        multiline
                                        name='areasForImprovement'
                                        rows={3}
                                        InputLabelProps={{
                                            style: {
                                                fontSize: '14px',
                                            },
                                        }}
                                        variant='outlined'
                                        size='small'
                                    />
                                </Box>
                                <ConditionallyRender
                                    condition={Boolean(selectedScore)}
                                    show={
                                        <StyledButton
                                            variant='contained'
                                            color='primary'
                                            type='submit'
                                        >
                                            Send Feedback
                                        </StyledButton>
                                    }
                                />
                            </StyledForm>
                        </StyledContent>
                    </StyledContainer>
                </ParentContainer>
            }
        />
    );
};
