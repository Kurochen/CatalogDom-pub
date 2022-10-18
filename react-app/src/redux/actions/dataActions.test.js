import { filterQuery } from './dataActions'

test('filterQuery', () => {
    const testObj = {
        material: 'Дерево',
        brusType: 'Бревно',
        3: true,
        2: true,
        2.5: false,
        minArea: 10
    }
    expect(filterQuery(testObj)).toEqual(
        { "floors": [3, 2,], "query": [".where('material' '=' 'Дерево')", ".where('brusType' '=' 'Бревно')"] }
    )
})