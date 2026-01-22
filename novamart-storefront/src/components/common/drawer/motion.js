export const maskMotion = {
    motionAppear: true,
    motionName: 'mask-motion',
};

export const motion = (placement) => ({
    motionAppear: true,
    motionName: `panel-motion-${placement}`,
});

const motionProps = {
    maskMotion,
    motion,
};

export default motionProps;
