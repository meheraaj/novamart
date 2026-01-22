import groupBy from 'lodash/groupBy';

export function getVariations(variations) {
    if (!variations) return {};
    return groupBy(variations, 'attribute.slug');
}
