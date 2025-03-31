dates = '''
'''

values = '''
'''

result = {}
d, v = dates.split(), values.split()
for i in range(len(d)):
    result[d[i]] = v[i]

print(result)