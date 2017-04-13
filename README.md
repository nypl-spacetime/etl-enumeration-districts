# NYC Space/Time Directory ETL module: New York City Enumeration Districts

[ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) module for NYPL's [NYC Space/Time Direcory](http://spacetime.nypl.org/). This Node.js module downloads, parses, and/or transforms New York City Enumeration Districts data, and creates a NYC Space/Time Directory dataset.

## Details

<table>
<tbody>

<tr>
<td>ID</td>
<td><code>enumeration-district</code></td>
</tr>

<tr>
<td>Title</td>
<td>New York City Enumeration Districts</td>
</tr>

<tr>
<td>Description</td>
<td>1900 census enumeration districts for Manhattan and the Bronx, traced from maps created by Barbara Hillman</td>
</tr>

<tr>
<td>License</td>
<td>CC0</td>
</tr>

<tr>
<td>Author</td>
<td>NYPL</td>
</tr>

<tr>
<td>Website</td>
<td><a href="https://www.nypl.org/">https://www.nypl.org/</a></td>
</tr>
</tbody>
</table>

## Available steps

  - `download`
  - `transform`

## Usage

```
git clone https://github.com/nypl-spacetime/etl-enumeration-district.git /path/to/etl-modules
cd /path/to/etl-modules/etl-enumeration-district
npm install

spacetime-etl enumeration-district[.<step>]
```

See http://github.com/nypl-spacetime/spacetime-etl for information about Space/Time's ETL tool. More Space/Time ETL modules [can be found on GitHub](https://github.com/search?utf8=%E2%9C%93&q=org%3Anypl-spacetime+etl-&type=Repositories&ref=advsearch&l=&l=).

# Data

The dataset created by this ETL module's `transform` step can be found in the [data section of the NYC Space/Time Directory website](http://spacetime.nypl.org/#data-enumeration-district).

_This README file is generated by [generate-etl-readme](https://github.com/nypl-spacetime/generate-etl-readme)._
